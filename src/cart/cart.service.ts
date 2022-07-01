import { Injectable } from '@nestjs/common';
import { Cart } from './cart.entity';
import { CartItem } from './cart-item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItemInfo } from './dto/cart.dto';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { CartRepository } from './cart.repository';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>
  ) {}

  async fetchCart(user: User): Promise<Cart> {
    return this.cartRepository.findOne({
      where: { userId: user['id'] },
    });
  }

  async fetchProductPrice(id: number): Promise<any> {
    return CartRepository.fetchProductPrice(id);
  }

  /* helper function */
  async fetchItems(user: User): Promise<CartItem[]> {
    return CartRepository.fetchItems(user);
  }

  async fetchCartItems(user: User): Promise<CartItemInfo> {
    return CartRepository.fetchCartItems(user);
  }

  async createCart(user: User): Promise<Cart> {
    return CartRepository.createCart(user);
  }

  /* adds a cartItemId to Cart entity and adds product to cart-item entity */
  async addToCart(id: number, user: User, qty: { quantity: number }): Promise<any> {
    return CartRepository.addToCart(id, user, qty);
  }

  async removeCartItem(productId: number, user: User): Promise<void> {
    return CartRepository.removeCartItem(productId, user);
  }

  async clearCart(user: User): Promise<any> {
    return CartRepository.clearCart(user);
  }
}
