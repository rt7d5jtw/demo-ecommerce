/// <reference types="node" />
import { Order } from './order.entity';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/order.do';
import { SearchOrdersDto } from './dto/search-orders.dto';
import { OrderItem } from './order-item.entity';
export declare class OrdersRepository extends Repository<Order> {
    fetch(searchOrdersDto: SearchOrdersDto, user: User): Promise<Order[]>;
    createInvoice(user: User, order: Order): Promise<Buffer>;
    createOrder(createOrderDto: CreateOrderDto, user: User): Promise<Order>;
    addOrderItems(id: string, user: User): Promise<OrderItem[]>;
}
