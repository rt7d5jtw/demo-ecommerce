import { Order, OrderStatus } from './order.entity';
import { User } from '../users/user.entity';
import { EntityRepository, getConnection, getManager, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/order.do';
import { SearchOrdersDto } from './dto/search-orders.dto';
import { generateInvoiceInformation, generateInvoiceTable } from './invoice';
import { OrderItem } from './order-item.entity';
import * as PDFDocument from 'pdfkit';
import { UnprocessableEntityException, Logger } from '@nestjs/common';

@EntityRepository(Order)
export class OrdersRepository extends Repository<Order> {
  private logger = new Logger('OrdersRepository');
  async fetch(searchOrdersDto: SearchOrdersDto, user: User): Promise<Order[]> {
    const { status, search } = searchOrdersDto;
    const query = this.createQueryBuilder('order');

    query.where('order.userId = :userId', { userId: user.id });

    if (status) {
      query.andWhere('order.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'order.userId LIKE :search OR order.totalprice LIKE :search OR order.address LIKE :search',
        { search: `%${search}%` }
      );
    }

    const orders = await query.getMany();
    return orders;
  }

  async createInvoice(user: User, order: Order): Promise<Buffer> {
    /* gets order items with product information for the invoice */
    const manager = getManager();
    const orderItems = await manager.query(`
    SELECT "products"."title" AS "item", "products"."id" as "productId", "order-item"."quantity", "products"."price" AS "amount"
    FROM "orders"
    INNER JOIN "order-item" 
      ON "order-item"."orderId" = "orders"."id"
    INNER JOIN "products"
      ON "products"."id" = "order-item"."productId"
      WHERE "order-item"."orderId" = '${order.id}'
      AND "orders"."userId" = '${user['id']}'
      `);

    const invoice = {
      shipping: {
        email: user.email,
        address: order.address,
        city: order.city,
        country: order.country,
        postal_code: order.postalcode,
      },
      items: orderItems,
      subtotal: order.total_price,
      delivery: 5,
      invoice_nr: order.id,
    };

    const pdfBuffer: Buffer = await new Promise((resolve) => {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
        bufferPages: true,
      });

      // customize your PDF document
      generateInvoiceInformation(doc, invoice);
      generateInvoiceTable(doc, invoice);
      doc.end();

      const buffer = [];
      doc.on('data', buffer.push.bind(buffer));
      doc.on('end', () => {
        const data = Buffer.concat(buffer);
        resolve(data);
      });
    });
    return pdfBuffer;
  }

  async createOrder(createOrderDto: CreateOrderDto, user: User): Promise<Order> {
    const { total_price, address, country, city, postalcode } = createOrderDto;

    const order = new Order();
    order.total_price = total_price;
    order.address = address;
    order.country = country;
    order.city = city;
    order.postalcode = postalcode.toString();
    order.status = OrderStatus.PROCESSING;
    order.userId = user.id;

    for (const key in order) {
      if (order[key] === '' || order[key] === null || order[key] === undefined) {
        throw new UnprocessableEntityException('Missing values from the order');
      }
    }

    try {
      await order.save();
    } catch (err) {
      throw new Error(`Order could not be saved`);
    }

    await this.addOrderItems(order.id, user);

    return order;
  }

  async addOrderItems(id: string, user: User): Promise<OrderItem[]> {
    const userId = user['id'];
    const cartItems = await getManager().query(`
    SELECT ct."id", ct."price", ct."quantity", ct."productId" FROM "cart"
    JOIN "cart-item" as ct
      ON "cart"."id" = ct."cartId"
      WHERE "cart"."userId" = '${userId}'
      `);

    const orders = [];
    for (let i = 0; i < cartItems.length; i++) {
      const order = {
        orderId: null,
        price: null,
        quantity: null,
        product: null,
      };
      order.orderId = id;
      order.price = cartItems[i].price;
      order.quantity = cartItems[i].quantity;
      order.product = cartItems[i].productId;
      orders.push(order);
    }
    await getConnection().createQueryBuilder().insert().into(OrderItem).values(orders).execute();

    return cartItems;
  }
}
