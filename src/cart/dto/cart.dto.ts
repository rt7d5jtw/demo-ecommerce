export class CartDto {
  id: string;
  userId: string;
  CartItemId: string;
}

export class CartItemDto {
  title: string;
  productId: number;
  quantity: number;
  price: number;
}
