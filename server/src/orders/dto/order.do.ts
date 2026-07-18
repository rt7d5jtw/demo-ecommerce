import { OrderStatus } from '../order.entity';

export interface CreateOrderDto {
  total_price: number;
  address: string;
  country: string;
  city: string;
  postalcode: string;
}

export interface OrderItemDto {
  order_id: string;
  price: number;
  quantity: number;
  product_id: number;
}

interface IOrder extends CreateOrderDto {
  status: OrderStatus;
}

export type OrderIdDto = Pick<OrderItemDto, 'order_id'>;

export type UpdateOrderDto = Partial<IOrder>;
