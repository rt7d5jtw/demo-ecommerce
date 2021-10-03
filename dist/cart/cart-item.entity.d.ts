import { BaseEntity } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from '../product/product.entity';
export declare class CartItem extends BaseEntity {
    id: string | Promise<string>;
    cartId: string | null;
    productId: number;
    quantity: number;
    price: number;
    CreatedAt: Date;
    cart: Cart;
    product: Product[];
}
