import { Cart } from './cart.entity';
import { CartItem } from './cart-item.entity';
import { CartRepository } from './cart.repository';
import { CartItemInfo } from './dto/cart.dto';
import { User } from '../users/user.entity';
export declare class CartService {
    private cartRepository;
    constructor(cartRepository: CartRepository);
    fetchCart(user: User): Promise<Cart>;
    fetchItems(user: User): Promise<CartItem[]>;
    fetchCartItems(user: User): Promise<CartItemInfo>;
    fetchProductPrice(id: number): Promise<any>;
    createCart(user: User): Promise<Cart>;
    addToCart(id: number, user: User, qty: {
        quantity: number;
    }): Promise<any>;
    removeCartItem(productId: number, user: User): Promise<void>;
    clearCart(user: User): Promise<any>;
}
