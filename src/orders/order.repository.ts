import { Order, OrderStatus } from './order.entity';
import { User } from '../users/user.entity';
import { EntityRepository, getConnection, getManager, getRepository, Repository } from 'typeorm';
import { CreateOrderDto, OrderIdDto, OrderItemDto } from './dto/order.do';
import { SearchOrdersDto } from './dto/search-orders.dto';
import { generateInvoiceInformation, generateInvoiceTable } from './invoice';
import { OrderItem } from './order-item.entity';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import { UnprocessableEntityException } from '@nestjs/common';

@EntityRepository(Order)
export class OrderRepository extends Repository<Order> {
  async getOrders(searchOrdersDto: SearchOrdersDto, user: User): Promise<Order[]> {
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
    SELECT "products"."title" AS "item", "products"."description",
      "products"."id" as "productId", "order-item"."quantity", "products"."price" AS "amount"
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
      const path = 'invoices/stuff.pdf';

      // customize your PDF document
      generateInvoiceInformation(doc, invoice);
      generateInvoiceTable(doc, invoice);
      doc.pipe(fs.createWriteStream(path));
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
    order.user = user;

    for (const key in order) {
      if (order[key] === '' || order[key] === null || order[key] === undefined) {
        throw new UnprocessableEntityException('Missing values from the order');
      }
    }

    try {
      await order.save();
      delete order.user;
    } catch (err) {
      throw new Error(`Order could not be saved`);
    }

    this.addOrderItems(order.id, user);

    return order;
  }

  async addOrderItems(id: string, user: User): Promise<OrderItem[]> {
    const orderItem = new OrderItem();

    /* get cartId */
    const userId = user['id'];
    const manager = getManager();
    const cartId = await manager.query(`
      SELECT id FROM "cart" as cart
      WHERE cart."userId" = '${userId}';
      `);

    const cartItems = await manager.query(`
      SELECT * FROM "cart-item" as ct
      WHERE ct."cartId" = '${cartId[0].id}';
      `);

    const orders = [];
    for (let i = 0; i < cartItems.length; i++) {
      /* iterates all the cart items into orders-array */
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
    /* insert to the array to database */
    await getConnection().createQueryBuilder().insert().into(OrderItem).values(orders).execute();

    return cartItems;
  }
}
