import { BaseEntity } from 'typeorm';
import { CartItem } from '../cart/cart-item.entity';
import { OrderItem } from '../orders/order-item.entity';
import { Category } from '../category/category.entity';
export declare enum ProductStatus {
    IN_STOCK = "IN_STOCK",
    OUT_OF_STOCK = "OUT_OF_STOCK"
}
export declare class Product extends BaseEntity {
    id: number;
    title: string;
    image: string;
    price: number;
    description: string;
    status: ProductStatus;
    createdAt: Date;
    updatedAt: Date;
    cartItem: CartItem[];
    orderItem: OrderItem[];
    categories: Category[];
}
