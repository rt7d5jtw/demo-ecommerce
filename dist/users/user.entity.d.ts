import { BaseEntity } from 'typeorm';
import { Cart } from '../cart/cart.entity';
import { Order } from '../orders/order.entity';
export declare enum UserRole {
    ADMIN = "ADMIN",
    USER = "USER"
}
export declare class User extends BaseEntity {
    id: string;
    email: string;
    password: string;
    role: UserRole;
    salt: string;
    createdAt: Date;
    cart: Cart;
    orders: Order[];
    validatePassword(password: string): Promise<boolean>;
}
