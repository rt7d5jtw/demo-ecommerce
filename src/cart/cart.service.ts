import { Injectable, NotFoundException } from '@nestjs/common';
import { Cart } from './cart.entity';
import { CartItem } from './cart-item.entity';
import { CartRepository } from './cart.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItemDto } from './dto/cart.dto';
import { User } from '../users/user.entity';
import { Product } from '../product/product.entity';
import { getRepository } from 'typeorm';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartRepository)
    private cartRepository: CartRepository,
  ) {}

  async getCart(
    user: User,
  ): Promise<Cart[]> {
    const userId = user["id"];
    const cartId = await this.cartRepository.find({
      where: [
        { "userId": userId }
      ]
    });
    return cartId;
  }

  async getCartItems(user: User): Promise<CartItem[]> {
    const cartId = await this.getCart(user);
    const cartItem = await getRepository(CartItem)
      .createQueryBuilder("cartItem")
      .select("cartItem")
      .where("cartItem.cartId = :cartId", { cartId: cartId[0].id })
      .getMany();

    return cartItem;
  }

  async getCartItem(user: User, id: string): Promise<CartItem> {
    const userId = user["id"];
    const cartId = await this.cartRepository.find({
      where: [
        { "userId": userId }
      ]
    });
    const cartItem = await getRepository(CartItem)
      .createQueryBuilder("cartItem")
      .where("cartItem.cartId = :cartId", { cartId: cartId[0].id })
      .andWhere("cartItem.id = :id", { id: id })
      .getOne()

    return cartItem;
  }

  async getProductPrice(id: number): Promise<number> {
    const productRepository = getRepository(Product);
    const product = await productRepository.findOne(id);
    return product["price"];
  }

  async createCart(user: User): Promise<Cart> {
    return this.cartRepository.createCart(user)
  }

  // adds a cartItemId to Cart entity and adds product to cart-item entity
  async addToCart(
    id: number,
    user: User,
    cartItemDto: CartItemDto,
  ): Promise<CartItem> {
    const { quantity } = cartItemDto;
    const cartId = await this.getCart(user);
    const price = await this.getProductPrice(id);

    const cartItem = new CartItem();

    cartItem.cartId = cartId[0].id;
    cartItem.quantity = quantity;
    cartItem.price = price * quantity;
    cartItem.productId = id;

    //const cartItems = this.getCartItems(user)
    // make comparison here looking for items with same ids

    return cartItem;
  };

  async removeCartItem(id: string, user: User): Promise<void | string> {
    /* get cart id */
    const userId = user["id"];
    const cartId = await this.cartRepository.find({
      where: [
        { "userId": userId }
      ]
    });

    const cartItem = await getRepository(CartItem)
      .createQueryBuilder("cartItem")
      .where("cartItem.cartId = :cartId", { cartId: cartId[0].id })
      .andWhere("cartItem.id = :id", { id: id })
      .getOne()

    if (cartItem == null) {
      throw new NotFoundException(`Cart Item with ID "${id}" not found`);
    }

    /* compare cartids */
    const cartIdCmp = cartId[0].id;
    const cartIdCmp2 = cartItem["cartId"];

    if (cartIdCmp === cartIdCmp2) {
      getRepository(CartItem).delete(id);
    } else if (cartIdCmp !== cartIdCmp2) {
      return "Item is not in user's cart or item does not exist";
    }
  }

  async clearCart(user: User): Promise<void> {
    /* get cart id */
    const userId = user["id"];
    const cartId = await this.cartRepository.find({
      where: [
        { "userId": userId }
      ]
    });

    /* uses cart id to delete all the items from user */
    const cartItemRepository = getRepository(CartItem);
    cartItemRepository.delete({ cartId: cartId[0].id });
  }
}
