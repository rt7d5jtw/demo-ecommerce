import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto, OrderIdDto, OrderItemDto } from './dto/order.do';
import { SearchOrdersDto } from './dto/search-orders.dto';
import { Order } from './order.entity';
import { User, UserRole } from '../users/user.entity';
import { OrderRepository } from './order.repository';
import { OrderItem } from './order-item.entity';
import { getRepository } from 'typeorm';
import { PaymentDto } from './dto/payment.dto';
import Stripe from 'stripe';
import { Readable } from 'stream';

const stripe = require('stripe')(
  'sk_test_51HUuCuDiJxi7nioJcrisEWkl6dtdxpbeKEF6DoQFbGxwlvqwCLfITvmxQPagXFAy8MpRzSO3GmgYXq91ir5sbNef00up3ewzgb'
);

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderRepository)
    private orderRepository: OrderRepository
  ) {}

  async getOrders(searchOrdersDto: SearchOrdersDto, user: User): Promise<Order[]> {
    return this.orderRepository.getOrders(searchOrdersDto, user);
  }

  async getOrderById(id: string, user: User): Promise<Order> {
    const result = await this.orderRepository.findOne({ where: { id, userId: user.id } });
    if (!result) {
      throw new NotFoundException(`Order with ID "${id}" not found`);
    }
    return result;
  }

  async getAllOrders(): Promise<Order[]> {
    return this.orderRepository.query('SELECT * FROM public.orders');
  }

  async getOrderItemById(id: string, user: User): Promise<OrderItem[]> {
    const userId = user['id'];
    const order = await this.orderRepository
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
    return this.orderRepository.createInvoice(user, order);
  }

  async createOrder(createOrderDto: CreateOrderDto, user: User): Promise<Order> {
    return this.orderRepository.createOrder(createOrderDto, user);
  }

  async getReadableStream(buffer: Buffer): Promise<Readable> {
    const stream = new Readable();

    stream.push(buffer);
    stream.push(null);

    return stream;
  }

  async deleteOrder(id: string, user: User): Promise<any> {
    /* get userid */
    const userId = user['id'];
    /* get order */
    const order = await this.orderRepository.find({
      where: [{ id: id }],
    });
    /*
    if (order.userId !== userId && user.role != UserRole.ADMIN) {
      throw new Error('Invalid authorization')
    }
    */
    const orderItemRepository = getRepository(OrderItem);
    orderItemRepository.delete({ orderId: order[0].id });

    const result = await this.orderRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Order with ID "${id}" not found`);
    }
  }

  async addOrderItems(id: string, user: User): Promise<OrderItem[]> {
    return this.orderRepository.addOrderItems(id, user);
  }
}
