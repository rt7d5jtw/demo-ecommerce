export declare class CartDto {
    id: string;
    userId: string;
    CartItemId: string;
}
export interface CartItemDto {
    title: string;
    productId: number;
    quantity: number;
    price: number;
}
export interface CartItemInfo extends CartItemDto {
    cartId: string;
    id: string;
    title: string;
    image: string;
}
