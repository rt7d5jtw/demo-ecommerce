import { Order, OrderStatus } from './order.entity';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/order.do';
import { SearchOrdersDto } from './dto/search-orders.dto';
import { generateInvoiceInformation, generateInvoiceTable } from './invoice';
import { OrderItem } from './order-item.entity';
import * as PDFDocument from 'pdfkit';
import { NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { AppDataSource } from 'src/config/typeorm.config';
import { Product } from 'src/product/product.entity';
import { PaymentDto } from './dto/payment.dto';
import Stripe from 'stripe';

interface OrdersRepositoryExtended {
  fetchOrderItems: (id: string) => Promise<OrderItem[]>;
  fetch: (arg0: SearchOrdersDto, user: User) => Promise<Order[]>;
  createInvoice: (user: User, order: Order) => Promise<Buffer>;
  createOrder: (createOrderDto: CreateOrderDto, user: User) => Promise<Order>;
  addOrderItems: (id: string, user: User) => Promise<OrderItem[]>;
  addPaymentIntent: (paymentDto: PaymentDto) => Promise<Stripe.PaymentIntent>;
  removeOrder: (id: string) => Promise<void>;
}

const OrdersRepository: Repository<Order> & OrdersRepositoryExtended = AppDataSource.getRepository(
  Order
).extend({
  async removeOrder(id: string): Promise<void> {
    const order = await this.ordersRepository.findOne({
      where: { id: id },
    });

    AppDataSource.getRepository(OrderItem).delete({ orderId: order.id });

    const result = await this.ordersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Order with ID "${id}" not found`);
    }
  },

  async addPaymentIntent(paymentDto: PaymentDto): Promise<Stripe.PaymentIntent> {
    const stripe = new Stripe(process.env.STRIPE_SECRET, { apiVersion: '2020-08-27' });
    const { amount, currency, payment_method_types, metadata } = paymentDto;
    const params: Stripe.PaymentIntentCreateParams = {
      // Stripe's API assumes amount in smallest currency unit
      // 100 is 1$
      amount: amount * 100,
      currency,
      payment_method_types: [payment_method_types],
      metadata,
    };
    const paymentIntent: Stripe.PaymentIntent = await stripe.paymentIntents.create(params);
    return paymentIntent;
  },

  /* Transactions in Order and OrderItem repositories */
  async fetchOrderItems(id: string): Promise<OrderItem[]> {
    const orderItems = await AppDataSource.getRepository(OrderItem)
      .createQueryBuilder('orderItem')
      .innerJoin(Product, 'product', 'product.id = orderItem.productId')
      .select([
        'product.id',
        'orderItem.orderId',
        'orderItem.quantity',
        'orderItem.price',
        'product.title',
        'product.image',
      ])
      .where('orderItem.orderId = :orderId', { orderId: id })
      .getRawMany();

    /* formats the array key names */
    for (let i = 0; i < orderItems.length; i++) {
      for (const key in orderItems[i]) {
        RegExp('(orderItem_)').test(key)
          ? delete Object.assign(orderItems[i], {
              [`${key.replace(/orderItem_/, '')}`]: orderItems[i][key],
            })[key]
          : key === 'product_id'
          ? ((orderItems[i]['productId'] = orderItems[i][key]), delete orderItems[i][key])
          : RegExp('(product_)(?!id)').test(key)
          ? delete Object.assign(orderItems[i], {
              [`${key.replace(/product_/, '')}`]: orderItems[i][key],
            })[key]
          : null;
      }
    }
    return orderItems;
  },

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
  },

  async createInvoice(user: User, order: Order): Promise<Buffer> {
    /* gets order items with product information for the invoice */
    const manager = AppDataSource.manager;
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
  },

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
  },

  /* auxiliary function used by createOrder */
  async addOrderItems(id: string, user: User): Promise<OrderItem[]> {
    const userId = user['id'];

    const manager = AppDataSource.manager;
    const cartItems = await manager.query(`
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

    await manager
      .createQueryBuilder()
      .createQueryBuilder()
      .insert()
      .into(OrderItem)
      .values(orders)
      .execute();

    return cartItems;
  },
});

export { OrdersRepository, OrdersRepositoryExtended };
