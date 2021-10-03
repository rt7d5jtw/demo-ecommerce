import { OrderStatus } from '../order.entity';
export interface CreateOrderDto {
    total_price: number;
    address: string;
    country: string;
    city: string;
    postalcode: string;
}
export interface OrderItemDto {
    orderId: string;
    price: number;
    quantity: number;
    productId: number;
}
interface IOrder extends CreateOrderDto {
    status: OrderStatus;
}
export declare type OrderIdDto = Pick<OrderItemDto, 'orderId'>;
export declare type UpdateOrderDto = Partial<IOrder>;
export {};
