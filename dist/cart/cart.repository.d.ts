import { Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { User } from '../users/user.entity';
export declare class CartRepository extends Repository<Cart> {
    createCart(user: User): Promise<Cart>;
}
