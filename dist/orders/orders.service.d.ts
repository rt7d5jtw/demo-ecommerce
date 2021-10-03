/// <reference types="node" />
import { CreateOrderDto, UpdateOrderDto } from './dto/order.do';
import { SearchOrdersDto } from './dto/search-orders.dto';
import { Order } from './order.entity';
import { User } from '../users/user.entity';
import { OrdersRepository } from './orders.repository';
import { OrderItem } from './order-item.entity';
import { PaymentDto } from './dto/payment.dto';
import { Readable } from 'stream';
import Stripe from 'stripe';
export declare class OrdersService {
    private ordersRepository;
    constructor(ordersRepository: OrdersRepository);
    fetch(searchOrdersDto: SearchOrdersDto, user: User): Promise<Order[]>;
    fetchById(id: string, user: User): Promise<Order>;
    fetchAll(): Promise<Order[]>;
    fetchOrderItems(id: string): Promise<OrderItem[]>;
    addPaymentIntent(paymentDto: PaymentDto): Promise<Stripe.PaymentIntent>;
    createInvoice(user: User, order: Order): Promise<Buffer>;
    create(createOrderDto: CreateOrderDto, user: User): Promise<Order>;
    getReadableStream(buffer: Buffer): Promise<Readable>;
    update(updateOrderDto: UpdateOrderDto, id: string): Promise<Order>;
    removeOrder(id: string): Promise<void>;
    addOrderItems(id: string, user: User): Promise<OrderItem[]>;
}
