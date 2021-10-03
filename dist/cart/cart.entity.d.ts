import { CartItem } from './cart-item.entity';
import { BaseEntity } from 'typeorm';
import { User } from '../users/user.entity';
export declare class Cart extends BaseEntity {
    id: string;
    userId: string | null;
    CreatedAt: Date;
    cartItems: CartItem[];
    user: User;
}
