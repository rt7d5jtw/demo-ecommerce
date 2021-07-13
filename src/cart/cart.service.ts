import { Injectable, NotFoundException } from '@nestjs/common';
import { Cart } from './cart.entity';
import { CartItem } from './cart-item.entity';
import { CartRepository } from './cart.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItemDto, CartItemInfo } from './dto/cart.dto';
import { User } from '../users/user.entity';
import { Product } from '../product/product.entity';
import { getRepository, getManager } from 'typeorm';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartRepository)
    private cartRepository: CartRepository
  ) {}

  async fetchCart(user: User): Promise<Cart> {
    const userId = user['id'];
    const cartId = await this.cartRepository.find({
      where: [{ userId: userId }],
    });
    return cartId[0];
  }

  async fetchCartItems(user: User): Promise<CartItem[]> {
    const cartId = await this.fetchCart(user);
    const cartItem = await getRepository(CartItem)
      .createQueryBuilder('cartItem')
      .select('cartItem')
      .where('cartItem.cartId = :cartId', { cartId: cartId.id })
      .getMany();

    return cartItem;
  }

  async fetchCartItem(user: User, id: string): Promise<CartItem> {
    /* get cartId */
    const userId = user['id'];
    const cartId = await this.cartRepository.find({
      where: [{ userId: userId }],
    });
    const cartItem = await getRepository(CartItem)
      .createQueryBuilder('cartItem')
      .where('cartItem.cartId = :cartId', { cartId: cartId[0].id })
      .andWhere('cartItem.id = :id', { id: id })
      .getOne();

    return cartItem;
  }

  async fetchCartState(user: User): Promise<CartItemInfo> {
    /* get cart id */
    const userId = user['id'];
    const cartId = await this.cartRepository.find({
      where: [{ userId: userId }],
    });
    if (cartId.length === 0) {
      throw new NotFoundException('User has no cart');
    }

    const manager = getManager();

    /* gets cart items with matching productId */
    const cartItems = await manager.query(`
      SELECT ct."productId", prods."title", 
      prods."image", prods."price", ct."quantity" FROM "cart-item" as ct
      JOIN "products" as prods
        ON prods."id" = ct."productId"
      WHERE ct."cartId" = '${cartId[0].id}';
      `);
    return cartItems;
  }

  async fetchProductPrice(id: number): Promise<number> {
    const productRepository = getRepository(Product);
    const product = await productRepository.findOne(id);
    return product['price'];
  }

  async createCart(user: User): Promise<Cart> {
    return this.cartRepository.createCart(user);
  }

  // adds a cartItemId to Cart entity and adds product to cart-item entity
  async addToCart(id: number, user: User, qty: { quantity: number }): Promise<any> {
    const { quantity } = qty;
    if (!quantity) {
      throw new NotFoundException('Quantity is missing');
    }
    const cartId = await this.fetchCart(user);
    if (!cartId) {
      throw new NotFoundException('User has no cart');
    }
    const price = await this.fetchProductPrice(id).catch(() => {
      throw new NotFoundException('Price could not be found');
    });

    const cartItem = new CartItem();

    cartItem.cartId = cartId.id;
    cartItem.quantity = quantity;
    cartItem.price = price * quantity;
    cartItem.productId = id;

    /* checks if Cart Items with same productId and cartId exists in the Cart Item table
     * if so it sums quantity and price of the two objects and removes the redundant copy 'cart_copy' */
    const cartItems = await this.fetchCartItems(user);
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
    await cartItem.save();
    return cartItem;
  }

  async removeCartItem(productId: number, user: User): Promise<void | string> {
    /* get cart id */
    const userId = user['id'];
    const cartId = await this.cartRepository.find({
      where: [{ userId: userId }],
    });

    const cartItem = await getRepository(CartItem)
      .createQueryBuilder('cartItem')
      .where('cartItem.cartId = :cartId', { cartId: cartId[0].id })
      .andWhere('cartItem.productId = :productId', { productId: productId })
      .getOne();

    if (cartItem == null) {
      throw new NotFoundException(`Cart Item with ID "${productId}" not found`);
    }

    const deletion_id = await cartItem.id;
    /* compare cartids */
    const cartIdCmp = cartId[0].id;
    const cartIdCmp2 = cartItem['cartId'];

    if (cartIdCmp === cartIdCmp2) {
      getRepository(CartItem).delete(deletion_id);
    } else if (cartIdCmp !== cartIdCmp2) {
      return "Item is not in user's cart or item does not exist";
    }
  }

  async clearCart(user: User): Promise<any> {
    /* get cart id */
    const userId = user['id'];
    const cartId = await this.cartRepository.find({
      where: [{ userId: userId }],
    });
    if (cartId.length === 0) {
      throw new NotFoundException('No cart found');
    }

    /* uses cart id to delete all the items from user */
    const cartItemRepository = getRepository(CartItem);
    cartItemRepository.delete({ cartId: cartId[0].id });
  }
}
