import { BaseEntity } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../product/product.entity';
export declare class OrderItem extends BaseEntity {
    id: string;
    orderId: string;
    price: number;
    quantity: number;
    order: Order;
    product: Product[];
}
