export class CreateOrderDto {
  total_price: number;
  address: string;
}

export class OrderItemDto {
  price: number;
  quantity: number;
}
