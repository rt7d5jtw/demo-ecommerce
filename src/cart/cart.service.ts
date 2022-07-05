import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Cart } from './cart.entity';
import { CartItem } from './cart-item.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { CartItemInfo } from './dto/cart.dto';
import { User } from '../users/user.entity';
import { DataSource, Repository, TypeORMError } from 'typeorm';
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
      where: { userId: user['id'] }
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
      where: { userId: user['id'] }
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
    const cart = await this.cartRepository.findOne({
      where: { userId: user['id'] }
    });

    if (!cart) throw new NotFoundException('User has no cart');

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
      WHERE ct."cartId" = '${cart['id']}';
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
    const cart = new Cart();
    cart.userId = user.id;
    return this.cartRepository.save(cart); // Easier to test if we use this instead the BaseEntity.
  }

  /* adds a cartItemId to Cart entity and adds product to cart-item entity */
  async addToCart(
    id: number,
    user: User,
    qty: { quantity: number }
  ): Promise<any> {
    // Validates the inputs
    if (!qty.quantity) {
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

    // Sets the new CartItem to align with the inputs
    const cartItem = new CartItem();

    cartItem.cartId = cart.id;
    cartItem.quantity = qty.quantity;
    cartItem.price = price * qty.quantity;
    cartItem.productId = id;

    /* checks if Cart Items with same productId and cartId exists in the Cart Item table
     * if so it sums quantity and price of the two objects and removes the redundant copy 'cart_copy' */
    const cartItems = await this.fetchItems(user);
    for (let i = 0; i < cartItems.length; i++) {
      if (
        cartItems[i].cartId === cartItem.cartId &&
        cartItems[i].productId === cartItem.productId
      ) {
        const productId = cartItems[i].productId;
        cartItem.quantity = cartItems[i].quantity + cartItem.quantity;
        cartItem.price = cartItems[i].price + cartItem.price;
        this.removeCartItem(productId, user);
      }
    }

    return cartItem.save();
  }

  /**
   * Removes a CartItem from User.
   * 1. Calls cartRepository.findOne with the input User.id,
   * 2. Calls cartItemRepository.createQueryBuilder to get the User CartItem
   * 3. If User CartItem was found, it is deleted.
   * */
  async removeCartItem(productId: number, user: User): Promise<void> {
    /* get cart id */
    const { id } = await this.cartRepository.findOne({
      where: { userId: user['id'] }
    });

    const cartItem = await this.cartItemRepository
      .createQueryBuilder('cartItem')
      .where('cartItem.cartId = :cartId', { cartId: id })
      .andWhere('cartItem.productId = :productId', { productId: productId })
      .getOne();

    if (!cartItem) throw new NotFoundException(`Cart Item was not found`);

    if (id === cartItem.cartId) {
      const result = await this.cartItemRepository.delete(await cartItem.id);
      if (result.affected === 0)
        throw new NotFoundException(
          "Item is not in user's cart or item does not exist"
        );
    }
  }

  /** Deletes the User's Cart which cascades to delete all the CartItem's from the User's Cart */
  async clearCart(user: User): Promise<any> {
    // Returns user's cart id
    const { id } = await this.cartRepository.findOne({
      where: { userId: user['id'] }
    });

    if (!id) throw new NotFoundException('No cart found');

    // TODO: FIX THIS!
    /* uses cart id to delete all the items from user */
    //return AppDataSource.getRepository(Cart).delete({ cartId: id });
    console.log('[cart.repository.ts] :: clearCart :: value returned ->', id);
    return this.cartItemRepository.find({
      where: { cartId: id }
    });
  }
}
