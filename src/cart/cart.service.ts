import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException
} from '@nestjs/common';
import { Cart } from './cart.entity';
import { CartItem } from './cart-item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItemInfo } from './dto/cart.dto';
import { User } from '../users/user.entity';
import { DeleteResult, Repository, TypeORMError } from 'typeorm';
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
    private productRepository: Repository<Product>
  ) {}

  /**
   * Returns the Cart of the User.
   * @param {User} user
   * @returns {Promise<Cart>}
   */
  async fetchCart(user: User): Promise<Cart> {
    return this.cartRepository.findOne({
      where: { userId: user['id'] }
    });
  }

  /**
   * Returns the CartItem's in the current Cart of the User.
   * @param {User} user - User context whose CartItem's are being returned.
   * @returns {Promise<CartItem[]>}
   */
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

  /**
   * Returns the Price of the Product.
   * @param {number} id - ID of the Product.
   * @returns {Promise<number>}
   */
  async fetchProductPrice(id: number): Promise<number> {
    const price = await this.productRepository.findOne({ where: { id: id } });
    if (!price) {
      throw new NotFoundException(`Price with ID "${id}" not found`);
    }
    return price.price;
  }

  /**
   * Queries for the CartItem's of the User's Cart and
   * returns them with additional information of title
   * and image taken from the Product properties.
   * @param {User} user
   * @returns {Promise<CartItemInfo>}
   */
  async fetchCartItems(user: User): Promise<CartItemInfo> {
    // Get Cart of the User to query for the CartItem's.
    const cart = await this.cartRepository.findOne({
      where: { userId: user['id'] }
    });

    if (!cart) throw new NotFoundException('User has no cart');

    try {
      // Gets cart items with matching productId.
      const cartItems = await this.cartItemRepository.query(`
      SELECT ct."productId", prods."title", 
      prods."image", prods."price", ct."quantity" FROM "cart-item" as ct
      JOIN "products" as prods
        ON prods."id" = ct."productId"
      WHERE ct."cartId" = '${cart['id']}';
      `);
      return cartItems;
    } catch (err) {
      this.logger.error(
        `Something went wrong while trying to connect or run transaction at cartService.fetchCartItems --`,
        err
      );
      throw new TypeORMError(`Error while connecting to make a transaction!`);
    }
  }

  /**
   * Creates a Cart for the User and returns it.
   * @param {User} user
   * @returns {Promise<Cart>}
   */
  async createCart(user: User): Promise<Cart> {
    const cart = new Cart();
    cart.userId = user.id;
    return this.cartRepository.save(cart); // Easier to test if we use this instead the BaseEntity.
  }

  /**
   * Adds a cartItemId to Cart entity and adds product to cart-item entity.
   * @param {number} id
   * @param {User} user
   * @param {{ quantity: number }} qty
   * @returns {Promise<any>}
   */
  async addToCart(
    id: number,
    user: User,
    qty: { quantity: number }
  ): Promise<any> {
    // Validates the inputs
    if (!qty.quantity) throw new NotFoundException('Quantity is missing');

    const cart = await this.fetchCart(user);
    if (!cart) throw new NotFoundException('User has no cart');

    const price = await this.fetchProductPrice(id);
    if (!price) throw new NotFoundException('Price could not be found');

    // Sets the new CartItem to align with the inputs
    const cartItem = new CartItem();

    cartItem.cartId = cart.id;
    cartItem.quantity = qty.quantity;
    cartItem.price = price * qty.quantity;
    cartItem.productId = id;

    /* Checks if Cart Items with same productId and cartId exists
     * in the Cart Item table, if so it sums quantity and price of the
     * two objects and removes the redundant copy 'cart_copy'.
     */
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

    return this.cartItemRepository.save(cartItem);
  }

  /**
   * Removes a CartItem from User.
   * 1. Calls cartRepository.findOne with the input User.id,
   * 2. Calls cartItemRepository.createQueryBuilder to get the User CartItem
   * 3. If User CartItem was found, it is deleted.
   * @param {number} productId
   * @param {User} user
   * @returns {Promise<DeleteResult>}
   * */
  async removeCartItem(productId: number, user: User): Promise<DeleteResult> {
    // Get User's Cart ID.
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

      return result;
    }

    throw new ConflictException(
      `User's Cart ID and CartItem's ID do not align. CartItem is not User's.`
    );
  }

  /**
   * Deletes the User's CartItem(s) and returns the {@link DeleteResult}.
   * @param {User} user
   * @returns {Promise<DeleteResult>}
   */
  async clearCart(user: User): Promise<DeleteResult> {
    // Returns user's cart id.
    const { id } = await this.cartRepository.findOne({
      where: { userId: user['id'] }
    });

    if (!id) throw new NotFoundException('No cart was found');

    this.logger.debug(
      '[cart.repository.ts] :: clearCart :: value returned -> ' + id
    );
    // Deletes all the CartItem's by the provided cartId.
    return this.cartItemRepository
      .createQueryBuilder()
      .delete()
      .from(CartItem, 'cartItem')
      .where('cart.id = :cartId', { cartId: id })
      .execute();
  }
}
