import { BaseEntity } from 'typeorm';
import { User } from '../users/user.entity';
import { OrderItem } from './order-item.entity';
export declare enum OrderStatus {
    PROCESSING = "PROCESSING",
    PAID = "PAID"
}
export declare class Order extends BaseEntity {
    id: string;
    userId: string;
    total_price: number;
    address: string;
    country: string;
    city: string;
    postalcode: string;
    status: OrderStatus;
    date: Date;
    user: User;
    orderitems: OrderItem[];
}
