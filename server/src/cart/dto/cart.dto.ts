export class CartDto {
  id: string;
  user_id: string;
  cart_item_id: string;
}

export interface CartItemDto {
  title: string;
  product_id: number;
  quantity: number;
  price: number;
}

export interface CartItemInfo extends CartItemDto {
  cart_id: string;
  id: string;
  title: string;
  image: string;
}
