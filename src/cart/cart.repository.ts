import { Cart } from './cart.entity';
import { User } from '../users/user.entity';
import { AppDataSource } from '../config/typeorm.config';
import { NotFoundException } from '@nestjs/common';
import { CartItem } from './cart-item.entity';
import { Product } from '../product/product.entity';
import { CartItemInfo } from './dto/cart.dto';

interface CartRepositoryExtended {
  createCart: (user: User) => Promise<Cart>;
  clearCart: (user: User) => Promise<any>;
  removeCartItem: (productId: number, user: User) => Promise<any>;
  addToCart: (id: number, user: User, qty: { quantity: number }) => Promise<any>;
  fetchProductPrice: (id: number) => Promise<any>;
  fetchItems: (user: User) => Promise<CartItem[]>;
  fetchCartItems: (user: User) => Promise<CartItemInfo>;
}

const CartRepository = AppDataSource.getRepository(Cart).extend({
  async fetchItems(user: User): Promise<CartItem[]> {
    const cart = await this.findOne({
      where: { userId: user['id'] },
    });
    const cartItem = await AppDataSource.getRepository(CartItem)
      .createQueryBuilder('cartItem')
      .select('cartItem')
      .where('cartItem.cartId = :cartId', { cartId: cart.id })
      .getMany();

    return cartItem;
  },

  async fetchCartItems(user: User): Promise<CartItemInfo> {
    /* get cart id */
    const userId = user['id'];
    const cart = await this.cartRepository.findOne({
      where: { userId: userId },
    });
    if (!cart) {
      throw new NotFoundException('User has no cart');
    }

    /* gets cart items with matching productId */

    const cartItems = await AppDataSource.manager.query(`
      SELECT ct."productId", prods."title", 
      prods."image", prods."price", ct."quantity" FROM "cart-item" as ct
      JOIN "products" as prods
        ON prods."id" = ct."productId"
      WHERE ct."cartId" = '${cart.id}';
      `);
    return cartItems;
  },

  async fetchProductPrice(id: number): Promise<any> {
    const price = await AppDataSource.getRepository(Product).findOne({ where: { id: id } });
    if (!price) {
      throw new NotFoundException(`Price with ID "${id}" not found`);
    }
    return price.price;
  },

  async createCart(user: User): Promise<Cart> {
    const cart = new Cart();
    cart.userId = user.id;
    return cart.save();
  },

  async clearCart(user: User): Promise<any> {
    /* get cart id */
    const userId = user['id'];

    const { id } = await this.cartRepository.findOne({
      where: { userId: userId },
    });

    if (!id) {
      throw new NotFoundException('No cart found');
    }

    // TODO: FIX THIS!
    /* uses cart id to delete all the items from user */
    //return AppDataSource.getRepository(Cart).delete({ cartId: id });
    console.log('[cart.repository.ts] :: clearCart :: value returned ->', id);
  },

  async removeCartItem(productId: number, user: User) {
    /* get cart id */
    const userId = user['id'];
    const { id } = await this.cartRepository.findOne({
      where: { userId: userId },
    });

    const cartItem = await AppDataSource.getRepository(CartItem)
      .createQueryBuilder('cartItem')
      .where('cartItem.cartId = :cartId', { cartId: id })
      .andWhere('cartItem.productId = :productId', { productId: productId })
      .getOne();

    if (!cartItem) {
      throw new NotFoundException(`Cart Item was not found`);
    }

    if (id === cartItem.cartId) {
      const result = await AppDataSource.getRepository(CartItem).delete(await cartItem.id);
      if (result.affected === 0) {
        throw new NotFoundException("Item is not in user's cart or item does not exist");
      }
    }
  },

  async addToCart(id: number, user: User, qty: { quantity: number }): Promise<any> {
    const { quantity } = qty;
    if (!quantity) {
      throw new NotFoundException('Quantity is missing');
    }
    const cart = await this.fetchCart(user);
    if (!cart) {
      throw new NotFoundException('User has no cart');
    }
    const price = await this.fetchProductPrice(id);
    if (!price) {
      throw new NotFoundException('Price could not be found');
    }

    const cartItem = new CartItem();

    cartItem.cartId = cart.id;
    cartItem.quantity = quantity;
    cartItem.price = price * quantity;
    cartItem.productId = id;

    /* checks if Cart Items with same productId and cartId exists in the Cart Item table
     * if so it sums quantity and price of the two objects and removes the redundant copy 'cart_copy' */
    const cartItems = await this.fetchItems(user);
    for (let i = 0; i < cartItems.length; i++) {
      if (
        cartItems[i].cartId === cartItem.cartId &&
        cartItems[i].productId === cartItem.productId
      ) {
        const cart_copy = cartItems[i].productId;
        cartItem.quantity = cartItems[i].quantity + cartItem.quantity;
        cartItem.price = cartItems[i].price + cartItem.price;
        this.removeCartItem(cart_copy, user);
      }
    }
    return cartItem.save();
  },
});

export { CartRepository, CartRepositoryExtended };
