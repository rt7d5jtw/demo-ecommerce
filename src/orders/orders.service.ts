import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto, UpdateOrderDto } from './dto/order.do';
import { SearchOrdersDto } from './dto/search-orders.dto';
import { Order } from './order.entity';
import { User } from '../users/user.entity';
import { OrdersRepository } from './orders.repository';
import { OrderItem } from './order-item.entity';
import { getRepository } from 'typeorm';
import { PaymentDto } from './dto/payment.dto';
import { Readable } from 'stream';
import Stripe from 'stripe';
//import { InjectStripeClient } from '@golevelup/nestjs-stripe';

@Injectable()
export class OrdersService {
  constructor(
    //@InjectStripeClient() private readonly stripeClient: Stripe,
    @InjectRepository(OrdersRepository)
    private ordersRepository: OrdersRepository
  ) {}

  async fetch(searchOrdersDto: SearchOrdersDto, user: User): Promise<Order[]> {
    return this.ordersRepository.fetch(searchOrdersDto, user);
  }

  async fetchById(id: string, user: User): Promise<Order> {
    const result = await this.ordersRepository.findOne({ where: { id, userId: user.id } });
    if (!result) {
      throw new NotFoundException(`Order with ID "${id}" not found`);
    }
    return result;
  }

  async fetchAll(): Promise<Order[]> {
    return this.ordersRepository.query('SELECT * FROM public.orders');
  }

  async fetchOrderItems(id: string, user: User): Promise<OrderItem[]> {
    const userId = user['id'];
    const order = await this.ordersRepository
      .createQueryBuilder('orders')
      .where('orders.userId = :userId', { userId: userId })
      .andWhere('orders.id = :id', { id: id })
      .getOne();

    const orderItems = await getRepository(OrderItem)
      .createQueryBuilder('orderItem')
      .where('orderItem.orderId = :orderId', { orderId: order.id })
      .getMany();

    return orderItems;
  }

  async addPaymentIntent(paymentDto: PaymentDto, user: User): Promise<Stripe.PaymentIntent> {
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
  }

  async createInvoice(user: User, order: Order): Promise<Buffer> {
    return this.ordersRepository.createInvoice(user, order);
  }

  async create(createOrderDto: CreateOrderDto, user: User): Promise<Order> {
    return this.ordersRepository.createOrder(createOrderDto, user);
  }

  async getReadableStream(buffer: Buffer): Promise<Readable> {
    const stream = new Readable();

    stream.push(buffer);
    stream.push(null);

    return stream;
  }

  async update(updateOrderDto: UpdateOrderDto, id: string): Promise<Order> {
    const order = await this.ordersRepository.findOne(id);
    const { total_price, address, country, city, postalcode, status } = updateOrderDto;
    order.total_price = total_price;
    order.address = address;
    order.country = country;
    order.city = city;
    order.postalcode = postalcode;
    order.status = status;

    try {
      await order.save();
    } catch {
      throw new Error('Order could not be saved');
    }
    return order;
  }

  async removeOrder(id: string, user: User): Promise<void> {
    const userId = user['id'];
    const order = await this.ordersRepository.findOne({
      where: { id: id },
    });
    /*
    if (order.userId !== userId && user.role != UserRole.ADMIN) {
      throw new Error('Invalid authorization')
    }
    */
    getRepository(OrderItem).delete({ orderId: order.id });

    const result = await this.ordersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Order with ID "${id}" not found`);
    }
  }

  async addOrderItems(id: string, user: User): Promise<OrderItem[]> {
    return this.ordersRepository.addOrderItems(id, user);
  }
}
