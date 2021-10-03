import { CreateOrderDto, UpdateOrderDto } from './dto/order.do';
import { SearchOrdersDto } from './dto/search-orders.dto';
import { OrdersService } from './orders.service';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { User } from '../users/user.entity';
import { PaymentDto } from './dto/payment.dto';
import { Response } from 'express';
import Stripe from 'stripe';
export declare class OrdersController {
    private ordersService;
    constructor(ordersService: OrdersService);
    fetch(searchOrdersDto: SearchOrdersDto, user: User): Promise<Order[]>;
    fetchAll(): Promise<Order[]>;
    addPaymentIntent(paymentDto: PaymentDto): Promise<Stripe.PaymentIntent>;
    getInvoice(user: User, orderId: string, res: Response): Promise<any>;
    addOrderItems(id: string, user: User): Promise<OrderItem[]>;
    fetchById(id: string, user: User): Promise<Order>;
    fetchOrderItems(id: string): Promise<OrderItem[]>;
    create(createOrderDto: CreateOrderDto, user: User): Promise<Order>;
    update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order>;
    removeOrder(id: string): Promise<void>;
}
