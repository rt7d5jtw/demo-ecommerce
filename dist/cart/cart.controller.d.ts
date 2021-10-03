import { CartService } from './cart.service';
import { CartItemInfo } from './dto/cart.dto';
import { CartItem } from './cart-item.entity';
import { Cart } from './cart.entity';
import { User } from '../users/user.entity';
export declare class CartController {
    private cartService;
    private logger;
    constructor(cartService: CartService);
    fetchCart(user: User): Promise<Cart>;
    fetchCartItems(user: User): Promise<CartItemInfo>;
    fetchProductPrice(id: number): Promise<number>;
    createCart(user: User): Promise<Cart>;
    addToCart(id: number, user: User, qty: {
        quantity: number;
    }): Promise<CartItem>;
    removeCartItem(productId: number, user: User): Promise<void | string>;
    clearCart(user: User): Promise<void>;
}
