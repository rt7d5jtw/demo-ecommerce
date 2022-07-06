import {
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto, UpdateOrderDto } from './dto/order.do';
import { SearchOrdersDto } from './dto/search-orders.dto';
import { Order, OrderStatus } from './order.entity';
import { User } from '../users/user.entity';
import { OrderItem } from './order-item.entity';
import { Repository, TypeORMError } from 'typeorm';
import { Readable } from 'stream';
import { PaymentDto } from './dto/payment.dto';
import { generateInvoiceInformation, generateInvoiceTable } from './invoice';
import { Product } from '../product/product.entity';
import Stripe from 'stripe';
import * as PDFDocument from 'pdfkit';

@Injectable()
export class OrdersService {
  private logger = new Logger('OrdersService');
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>
  ) {}

  /**
   * Searches for the Order's that are relevant to the User and the Order's are returned.
   * @param {SearchOrdersDto} searchOrdersDto - Optional search parameters.
   * @param {User} user - Owner of the Order.
   * @returns {Promise<Order[]>} Returns the relevant Order's to the User.
   */
  async fetch(searchOrdersDto: SearchOrdersDto, user: User): Promise<Order[]> {
    const query = this.ordersRepository.createQueryBuilder('order');

    query.where('order.userId = :userId', { userId: user.id });

    if (searchOrdersDto) {
      if (searchOrdersDto.status)
        query.andWhere('order.status = :status', {
          status: searchOrdersDto['status']
        });

      if (searchOrdersDto.search)
        query.andWhere(
          `order.userId LIKE :search 
          OR order.totalprice LIKE :search 
          OR order.address LIKE :search
          `,
          { search: `%${searchOrdersDto.search}%` }
        );
    }

    const orders = await query.getMany();
    return orders;
  }

  /**
   * Searches for the Order by the specified ID and returns the Order.
   * NOTE: Only order's that are 'owned by' the User are returned!
   * @param {string} id - ID of the Order that is being searched.
   * @param {User} user - Provides the context for the Order's.
   * @returns {Promise<Order>} Returns the relevant Order based on the ID.
   */
  async fetchById(id: string, user: User): Promise<Order> {
    const result = await this.ordersRepository.findOne({
      where: { id, userId: user.id }
    });

    if (!result) throw new NotFoundException(`Order with ID "${id}" not found`);

    return result;
  }

  /**
   * Returns every possible Order from the storage.
   * @returns {Promise<Order[]>} Returns all the Order's.
   */
  async fetchAll(): Promise<Order[]> {
    return this.ordersRepository.query(
      'SELECT id, "userId", address, status, "date", country, city, total_price, postalcode FROM orders;'
    );
  }

  /**
   * Creates an invoice for the User.
   * @param {User} user
   * @param {Order} order
   * @returns {Promise<Buffer>}
   */
  async createInvoice(user: User, order: Order): Promise<Buffer> {
    /* Gets order items with product information for the invoice. */
    const orderItems = await this.ordersRepository.query(`
    SELECT "products"."title" AS "item", 
           "products"."id" as "productId", 
           "order-item"."quantity", 
           "products"."price" AS "amount"
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
        postal_code: order.postalcode
      },
      items: orderItems,
      subtotal: order.total_price,
      delivery: 5,
      invoice_nr: order.id
    };

    const pdfBuffer: Buffer = await new Promise((resolve) => {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
        bufferPages: true
      });

      // customizes PDF document by the inputs
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

  /**
   * Creates an Order for the User from the createOrderDto inputs and
   * utilizes ordersService.addOrderItems to do an the relevant OrderItem's
   * to the OrderItem table.
   * @param {CreateOrderDto} createOrderDto
   * @param {User} user
   * @returns {Promise<Order>}
   */
  async create(createOrderDto: CreateOrderDto, user: User): Promise<Order> {
    const { total_price, address, country, city, postalcode } = createOrderDto;

    const order = this.ordersRepository.create();
    order.total_price = total_price ?? order.total_price;
    order.address = address ?? order.address;
    order.country = country ?? order.country;
    order.city = city ?? city;
    order.postalcode = postalcode.toString() ?? order.postalcode;
    order.status = OrderStatus.PROCESSING ?? order.status;
    order.userId = user.id ?? user.id;

    for (const key in order) {
      if (order[key] === '' || order[key] === null || order[key] === undefined)
        throw new UnprocessableEntityException('Missing values from the order');
    }

    try {
      await this.ordersRepository.save(order);
    } catch (err) {
      this.logger.debug(err);
      throw new TypeORMError(`Order could not be saved`);
    }

    await this.addOrderItems(order.id, user);

    return order;
  }

  /**
   * @param {Buffer} buffer
   * @returns {Promise<Readable>}
   */
  async getReadableStream(buffer: Buffer): Promise<Readable> {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
  }

  /**
   * Update's the Order with new inputs specified in the updateOrderDto and returns the current Order.
   * @param {UpdateOrderDto} updateOrderDto - Inputs to be assigned to the Order.
   * @param {string} id - The Order ID that is to be updated.
   * @returns {Promise<Order>}
   */
  async update(updateOrderDto: UpdateOrderDto, id: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({ where: { id: id } });
    if (order === null || order === undefined)
      throw new NotFoundException(`Order with ID "${id}" could not be found.`);

    order.total_price = updateOrderDto.total_price ?? order.total_price;
    order.address = updateOrderDto.address ?? order.address;
    order.country = updateOrderDto.country ?? order.country;
    order.city = updateOrderDto.city ?? order.city;
    order.postalcode = updateOrderDto.postalcode ?? order.postalcode;
    order.status = updateOrderDto.status ?? order.status;

    try {
      await this.ordersRepository.save(order);
    } catch {
      throw new TypeORMError('Order could not be saved');
    }

    return order;
  }

  /**
   * Creates an Stripe Payment Intent via the Payment Intents API [here](https://stripe.com/docs/payments/payment-intents).
   * @param {PaymentDto} paymentDto
   * @returns {Promise<Stripe.PaymentIntent>}
   */
  async addPaymentIntent(
    paymentDto: PaymentDto
  ): Promise<Stripe.PaymentIntent> {
    const stripe = new Stripe(process.env.STRIPE_SECRET, {
      apiVersion: '2020-08-27'
    });
    const { amount, currency, payment_method_types, metadata } = paymentDto;
    const params: Stripe.PaymentIntentCreateParams = {
      // Stripe's API assumes amount in smallest currency unit
      // 100 is 1$
      amount: amount * 100,
      currency,
      payment_method_types: [payment_method_types],
      metadata
    };

    const paymentIntent: Stripe.PaymentIntent =
      await stripe.paymentIntents.create(params);

    return paymentIntent;
  }

  /**
   * Queries for the OrderItem's of the Order and returns them to the User.
   * The OrderItem's relevant to the Order are returned with more information
   * than the OrderItem itself provides by inner joining the Product table and
   * using the productId as the join predicate, so that title and image can be
   * added to the OrderItem's properties that are returned.
   * @param {string} id
   * @returns {Promise<(OrderItem & Pick<Product, "title" | "image">)[]>}
   */
  async fetchOrderItems(
    id: string
  ): Promise<(OrderItem & Pick<Product, 'title' | 'image'>)[]> {
    const orderItems = await this.orderItemRepository
      .createQueryBuilder('orderItem')
      .innerJoin(Product, 'product', 'product.id = orderItem.productId')
      .select([
        'product.id',
        'orderItem.orderId',
        'orderItem.quantity',
        'orderItem.price',
        'product.title',
        'product.image'
      ])
      .where('orderItem.orderId = :orderId', { orderId: id })
      .getRawMany();

    /* Formats the array key names */
    for (let i = 0; i < orderItems.length; i++) {
      for (const key in orderItems[i]) {
        RegExp('(orderItem_)').test(key)
          ? delete Object.assign(orderItems[i], {
              [`${key.replace(/orderItem_/, '')}`]: orderItems[i][key]
            })[key]
          : key === 'product_id'
          ? ((orderItems[i]['productId'] = orderItems[i][key]),
            delete orderItems[i][key])
          : RegExp('(product_)(?!id)').test(key)
          ? delete Object.assign(orderItems[i], {
              [`${key.replace(/product_/, '')}`]: orderItems[i][key]
            })[key]
          : null;
      }
    }

    return orderItems;
  }

  /**
   * Belongs to the execution of the creation of the Order, this method adds
   * the CartItem's from the User's Cart to the Order. This is done by querying
   * the CartItem's by inner joining Cart and CartItem tables, using cartId as the
   * join predicate and looking only for rows where CartId is equal to the relevant
   * User ID. This way we end up with the relevant CartItem's to add to the OrderItem table.
   * @param {string} id - ID of the Order.
   * @param {User} user - User that the OrderItem's are added to.
   * @returns {Promise<OrderItem[]>} OrderItem's that are added are returned.
   */
  async addOrderItems(id: string, user: User): Promise<OrderItem[]> {
    /* Queries for the CartItem's in the User's Cart by,
     * the User's ID, so what is returned is the CartItem's
     * of the User from the CartItem table.
     *
     * Example: (Single CartItem in the Cart of the User)
     * {
     *   id: 0fab7f2f-ddca-44fe-86fc-730e30cc8ac6
     *   price: 6.5
     *   quantity: 1
     *   productId: 40
     * }
     */
    const cartItems = await this.ordersRepository.query(`
    SELECT ct."id", ct."price", ct."quantity", ct."productId" FROM "cart"
    INNER JOIN "cart-item" as ct
      ON "cart"."id" = ct."cartId"
      WHERE "cart"."userId" = '${user['id']}'
      `);

    // Templates the CartItem's into OrderItem's for
    const orders = [];
    for (let i = 0; i < cartItems.length; i++) {
      const order = {
        orderId: null,
        price: null,
        quantity: null,
        product: null
      };

      this.logger.debug(
        `During execution of OrdersService.addOrderItems, orders -> ${orders}`
      );

      order.orderId = id;
      order.price = cartItems[i].price;
      order.quantity = cartItems[i].quantity;
      order.product = cartItems[i].productId;
      orders.push(order);
    }

    await this.orderItemRepository
      .createQueryBuilder()
      .insert()
      .into(OrderItem)
      .values(orders)
      .execute();

    return cartItems;
  }

  /**
   * Removes the Order on the specified id.
   * @param {string} id - ID of the Order to be removed.
   * @returns {Promise<void>}
   */
  async removeOrder(id: string): Promise<void> {
    const order = await this.ordersRepository.findOne({
      where: { id: id }
    });

    this.orderItemRepository.delete({ orderId: order.id });

    const result = await this.ordersRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Order with ID "${id}" not found`);
  }
}
