import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto, OrderIdDto, OrderItemDto } from './dto/order.do';
import { SearchOrdersDto } from './dto/search-orders.dto';
import { Order } from './order.entity';
import { User } from '../users/user.entity';
import { OrderRepository } from './order.repository';
import { OrderItem } from './order-item.entity';
import { getRepository } from 'typeorm';
import { PaymentDto } from './dto/payment.dto';
import Stripe from 'stripe';

const stripe = require('stripe')('sk_test_51HUuCuDiJxi7nioJcrisEWkl6dtdxpbeKEF6DoQFbGxwlvqwCLfITvmxQPagXFAy8MpRzSO3GmgYXq91ir5sbNef00up3ewzgb')

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderRepository)
    private orderRepository: OrderRepository,
  ) {}

  async getOrders(
    searchOrdersDto: SearchOrdersDto,
    user: User,
  ): Promise<Order[]> {
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

  async getOrderItemById(id: string, user: User): Promise<OrderItem> {
    const userId = user["id"];
    const orderId = await this.orderRepository.find({
      where: [
        { "userId": userId }
      ]
    });
    const orderItem = await getRepository(OrderItem)
      .createQueryBuilder("orderItem")
      .where("orderItem.orderId = :orderId", { orderId: orderId[0].id })
      .andWhere("orderItem.id = :id", { id: id })
      .getOne()

    return orderItem;
  }

  async addPaymentIntent(
    paymentDto: PaymentDto,
    user: User,
  ): Promise<Stripe.PaymentIntent> {
    const { amount, currency, payment_method_types, metadata } = paymentDto;
    const params: Stripe.PaymentIntentCreateParams = {
      // Stripe's API assumes amount in smallest currency unit
      // 100 is 1$
      amount: amount * 100,
      currency,
      payment_method_types: [payment_method_types],
      metadata
    }
    const paymentIntent: Stripe.PaymentIntent = await stripe.paymentIntents.create(
      params
    );
    return paymentIntent;
  }

  async createInvoice(
    user: User,
  ): Promise<Buffer> {
    return this.orderRepository.createInvoice(user)
  }

  async createOrder(
    createOrderDto: CreateOrderDto,
    user: User,
  ): Promise<Order> {
    return this.orderRepository.createOrder(createOrderDto, user);
  }

  async deleteOrder(id: string, user: User): Promise<void> {
    const userId = user["id"];
    const orderId = await this.orderRepository.find({
      where: [
        { "userId": userId }
      ]
    });

    const orderItemRepository = getRepository(OrderItem);
    orderItemRepository.delete({ orderId: orderId[0].id });

    const result = await this.orderRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Order with ID "${id}" not found`);
    }
  }

  async addOrderItems(
    orderIdDto: OrderIdDto,
    user: User,
  ): Promise<OrderItem[]> {
    return this.orderRepository.addOrderItems(orderIdDto, user)
  }

}
