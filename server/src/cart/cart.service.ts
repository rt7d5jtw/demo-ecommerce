import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  PreconditionFailedException
} from '@nestjs/common';
import { Cart } from './cart.entity';
import { CartItem } from './cart-item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItemInfo } from './dto/cart.dto';
import { User } from '../users/user.entity';
import { DeleteResult, InsertResult, Repository, TypeORMError } from 'typeorm';
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
      where: { user_id: user['id'] }
    });
  }

  /**
   * Returns the CartItem's in the current Cart of the User.
   * @param {User} user - User context whose CartItem's are being returned.
   * @returns {Promise<CartItem[]>}
   */
  async fetchItems(user: User): Promise<CartItem[]> {
    const cart = await this.cartRepository.findOne({
      where: { user_id: user['id'] }
    });
    const cartItems = await this.cartItemRepository
      .createQueryBuilder('cart_item')
      .select('cart_item')
      .where('cart_item.cart_id = :cart_id', { cart_id: cart.id })
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
      where: { user_id: user['id'] }
    });

    if (!cart) throw new NotFoundException('User has no cart');

    try {
      // Gets cart items with matching product_id.
      const cartItems = await this.cartItemRepository.query(`
      SELECT ct."product_id", prods."title", 
      prods."image", prods."price", ct."quantity" FROM "cart_item" as ct
      JOIN "products" as prods
        ON prods."id" = ct."product_id"
      WHERE ct."cart_id" = '${cart['id']}';
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
    const userCart = await this.cartRepository.findOne({
      where: { user_id: user['id'] }
    });

    if (userCart != null)
      throw new PreconditionFailedException(`User already has a Cart!`);

    const cart = new Cart();
    cart.user_id = user.id;
    cart.created_at = new Date();
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

    cartItem.cart_id = cart.id;
    cartItem.quantity = parseFloat(qty.quantity as unknown as string); // qty.quantity arrives as a string
    cartItem.price = price * parseFloat(qty.quantity as unknown as string);
    cartItem.product_id = id;
    cartItem.created_at = new Date();

    this.logger.log('qty.quantity -> ' + typeof qty.quantity);
    this.logger.log('cartItem.quantity -> ' + typeof cartItem.quantity);
    /* Checks if Cart Items with same product_id and cart_id exists
     * in the Cart Item table, if so it sums quantity and price of the
     * two objects and removes the redundant copy 'cart_copy'.
     */
    const cartItems = await this.fetchItems(user);
    for (let i = 0; i < cartItems.length; i++) {
      if (
        cartItems[i].cart_id === cartItem.cart_id &&
        cartItems[i].product_id === cartItem.product_id
      ) {
        this.logger.log('cartItems 2 -> ' + typeof cartItem.quantity);
        const product_id = cartItems[i].product_id;
        cartItem.quantity = cartItems[i].quantity + cartItem.quantity;
        cartItem.price = cartItems[i].price + cartItem.price;

        await this.removeCartItem(product_id, user);
      }
    }

    return this.cartItemRepository.save(cartItem);
  }

  /**
   * Adds a batch of Products as CartItem's to the User's Cart by adding them to CartItem table returns the added CartItem's.
   * @param {Array<string>} productIDArray - List of Product ID strings, same IDs are interpreted as added quantities.
   * @param {User} user
   * @returns {Promise<InsertResult>}
   */
  async batchAddProducts(
    productIDArray: Array<number>,
    user: User
  ): Promise<InsertResult> {
    if (productIDArray.length < 1)
      throw new BadRequestException(
        `Array does not contain any IDs, bad request!`
      );

    const cart = await this.fetchCart(user);
    if (!cart) throw new NotFoundException('User has no cart');

    const productMap: Map<number, number> = productIDArray.reduce(
      (state: Map<number, number>, action: number) => {
        if (typeof action != 'number')
          throw new BadRequestException(`Product IDs need to be integers!`);

        if (state.has(action)) {
          state.set(action, state.get(action) + 1);
          return state;
        }

        state.set(action, 1);
        return state;
      },
      new Map<number, number>()
    );

    // Map each product with properties.
    const cartItemBatch: CartItem[] = [];
    for (const [id, qty] of productMap) {
      // Sets the new CartItem to align with the inputs
      const cartItem = new CartItem();

      const price = await this.fetchProductPrice(id);
      if (!price) throw new NotFoundException('Price could not be found');

      cartItem.cart_id = cart.id;
      cartItem.quantity = qty;
      cartItem.price = price * qty;
      cartItem.product_id = id;
      cartItem.created_at = new Date();

      cartItemBatch.push(cartItem); // Add the cartItem to the list.
    }

    // The cart-item table is not assumed to have any current CartItems,
    // because the state of the "cart", is always cleared after each order.
    const cartItems = await this.fetchItems(user);
    if (cartItems.length != 0)
      throw new PreconditionFailedException(
        `User's current cart already has items!`
      );

    return await this.cartItemRepository.insert(cartItemBatch);
  }

  /**
   * Removes a CartItem from User.
   * 1. Calls cartRepository.findOne with the input User.id,
   * 2. Calls cartItemRepository.createQueryBuilder to get the User CartItem.
   * 3. If User CartItem was found, it is deleted.
   * ! NOTE: This always reports affected as '1', because it describes rows affected.
   * @param {number} productId
   * @param {User} user
   * @returns {Promise<DeleteResult>}
   * */
  async removeCartItem(productId: number, user: User): Promise<DeleteResult> {
    // Get User's Cart ID.
    const cart = await this.cartRepository.findOne({
      where: { user_id: user['id'] }
    });

    const cartItem = await this.cartItemRepository
      .createQueryBuilder('cart_item')
      .where('cart_item.cart_id = :cart_id', { cart_id: cart['id'] })
      .andWhere('cart_item.product_id = :product_id', { product_id: productId })
      .getOne();

    if (!cartItem) throw new NotFoundException(`Cart Item was not found`);

    if (cart['id'] === cartItem.cart_id) {
      const result = await this.cartItemRepository.delete(cartItem.id);
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
      where: { user_id: user['id'] }
    });

    if (!id) throw new NotFoundException('No cart was found');

    this.logger.debug(
      '[cart.repository.ts] :: clearCart :: value returned -> ' + id
    );
    // Deletes all the CartItem's by the provided cart_id.
    return this.cartItemRepository
      .createQueryBuilder()
      .delete()
      .from(CartItem, 'cart_item')
      .where('cart.id = :cart_id', { cart_id: id })
      .execute();
  }

  /**
   * Deletes the User's Cart from the cart table and returns the {@link DeleteResult}.
   * @param {User} user
   * @returns {Promise<DeleteResult>}
   */
  async removeCart(user: User): Promise<DeleteResult> {
    // Returns user's cart id.
    const cart = await this.cartRepository.findOne({
      where: { user_id: user['id'] }
    });

    if (!cart) throw new NotFoundException('No cart was found');

    // DELETE query in the cart table for the row that aligns with UserId.
    return this.cartRepository
      .createQueryBuilder()
      .delete()
      .from(Cart, 'cart')
      .where('user.id = :user_id', { user_id: user['id'] })
      .execute();
  }
}
