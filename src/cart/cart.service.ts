import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Cart } from './cart.entity';
import { CartItem } from './cart-item.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { CartItemInfo } from './dto/cart.dto';
import { User } from '../users/user.entity';
import { DataSource, Repository, TypeORMError } from 'typeorm';
import { CartRepository } from './cart.repository';
import { Product } from '../product/product.entity';

@Injectable()
export class CartService {
  private logger = new Logger('CartService');
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectDataSource()
    private dataSource: DataSource
  ) {}

  async fetchCart(user: User): Promise<Cart> {
    return this.cartRepository.findOne({
      where: { userId: user['id'] },
    });
  }

  async fetchProductPrice(id: number): Promise<number> {
    const price = await this.productRepository.findOne({ where: { id: id } });
    if (!price) {
      throw new NotFoundException(`Price with ID "${id}" not found`);
    }
    return price.price;
  }

  /* helper function */
  async fetchItems(user: User): Promise<CartItem[]> {
    const cart = await this.cartRepository.findOne({
      where: { userId: user['id'] },
    });
    const cartItems = await this.cartItemRepository
      .createQueryBuilder('cartItem')
      .select('cartItem')
      .where('cartItem.cartId = :cartId', { cartId: cart.id })
      .getMany();

    return cartItems;
  }

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
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const cartItems = await queryRunner.manager.query(`
      SELECT ct."productId", prods."title", 
      prods."image", prods."price", ct."quantity" FROM "cart-item" as ct
      JOIN "products" as prods
        ON prods."id" = ct."productId"
      WHERE ct."cartId" = '${cart.id}';
      `);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return cartItems;
    } catch (err) {
      this.logger.error(
        `Something went wrong while trying to connect or run transaction at cartService.fetchCartItems --`,
        err
      );
      await queryRunner.rollbackTransaction();
      throw new TypeORMError(`Error while connecting to make a transaction!`);
    }
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
