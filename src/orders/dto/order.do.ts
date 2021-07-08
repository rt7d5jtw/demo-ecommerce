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

export type OrderIdDto = Pick<OrderItemDto, 'orderId'>;
