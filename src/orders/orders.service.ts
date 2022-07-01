import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto, UpdateOrderDto } from './dto/order.do';
import { SearchOrdersDto } from './dto/search-orders.dto';
import { Order } from './order.entity';
import { User } from '../users/user.entity';
import { OrdersRepository } from './orders.repository';
import { OrderItem } from './order-item.entity';
import { Repository } from 'typeorm';
import { Readable } from 'stream';
import { PaymentDto } from './dto/payment.dto';
import Stripe from 'stripe';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>
  ) {}

  async fetch(searchOrdersDto: SearchOrdersDto, user: User): Promise<Order[]> {
    return OrdersRepository.fetch(searchOrdersDto, user);
  }

  async fetchById(id: string, user: User): Promise<Order> {
    const result = await this.ordersRepository.findOne({ where: { id, userId: user.id } });
    if (!result) {
      throw new NotFoundException(`Order with ID "${id}" not found`);
    }
    return result;
  }

  async fetchAll(): Promise<Order[]> {
    return OrdersRepository.fetchAll();
  }

  async createInvoice(user: User, order: Order): Promise<Buffer> {
    return OrdersRepository.createInvoice(user, order);
  }

  async create(createOrderDto: CreateOrderDto, user: User): Promise<Order> {
    return OrdersRepository.createOrder(createOrderDto, user);
  }

  async getReadableStream(buffer: Buffer): Promise<Readable> {
    const stream = new Readable();

    stream.push(buffer);
    stream.push(null);

    return stream;
  }

  async update(updateOrderDto: UpdateOrderDto, id: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({ where: { id: id } });
    const { total_price, address, country, city, postalcode, status } = updateOrderDto;
    order.total_price = total_price ?? order.total_price;
    order.address = address ?? order.address;
    order.country = country ?? order.country;
    order.city = city ?? order.city;
    order.postalcode = postalcode ?? order.postalcode;
    order.status = status ?? order.status;

    try {
      await order.save();
    } catch {
      throw new Error('Order could not be saved');
    }
    return order;
  }

  async addPaymentIntent(paymentDto: PaymentDto): Promise<Stripe.PaymentIntent> {
    return OrdersRepository.addPaymentIntent(paymentDto);
  }

  async removeOrder(id: string): Promise<void> {
    return OrdersRepository.removeOrder(id);
  }

  async fetchOrderItems(id: string): Promise<OrderItem[]> {
    return OrdersRepository.fetchOrderItems(id);
  }

  async addOrderItems(id: string, user: User): Promise<OrderItem[]> {
    return OrdersRepository.addOrderItems(id, user);
  }
}
