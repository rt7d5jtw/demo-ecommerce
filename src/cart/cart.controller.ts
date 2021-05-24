import { Controller, Get, Body, Param, Post, Delete, ValidationPipe, UsePipes, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CartService } from './cart.service';
import { CartItemDto, CartItemInfo } from './dto/cart.dto';
import { CartItem } from './cart-item.entity';
import { Cart } from './cart.entity';
import { GetUser } from '../users/get_user.decorator';
import { User } from '../users/user.entity';
import { Logger } from '@nestjs/common';

@Controller('cart')
@UseGuards(AuthGuard())
export class CartController {
  private logger = new Logger('CartController');
  constructor(private cartService: CartService) {}

  /* get cart of the user*/
  @Get()
  getCart(
    @GetUser() user: User,
  ): Promise<Cart[]> {
    return this.cartService.getCart(user);
  }

  /* fetches cart items for the user */
  @Get('items')
  getCartItems(
    @GetUser() user: User,
  ): Promise<CartItem[]> {
    return this.cartService.getCartItems(user);
  }

  /* fetches title and image for cart items */
  @Get('/cartInfo')
  getCartInfo(
    @GetUser() user: User,
  ): Promise<CartItemInfo> {
    return this.cartService.getCartInfo(user);
  }

  /* get cart item based on id */
  @Get(':id')
  getCartItem(
    @GetUser() user: User,
    @Param('id') id: string,
  ): Promise<CartItem> {
    return this.cartService.getCartItem(user, id);
  }

  /* get product's price */
  @Get('/product/:id')
  getProductPrice(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<number> {
    return this.cartService.getProductPrice(id);
  }

  /* creates the cart for the user */
  @Post()
  @UsePipes(ValidationPipe)
  createCart(
    @GetUser() user: User,
  ): Promise<Cart> {
    return this.cartService.createCart(user);
  }

  /* puts a product in the cart */
  @Post(':id')
  @UsePipes(ValidationPipe)
  addToCart(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
    @Body() cartItemDto: CartItemDto,
  ): Promise<CartItem> {
    return this.cartService.addToCart(id, user, cartItemDto);
  }

  /*
  @Post(':id/checkout')
  @UsePipes(ValidationPipe)
  checkout(
    @Param('id') id: string,
    @Body() checkoutDto: CheckoutDto,
  ): Promise<void> {
    return this.cartService.checkout(checkoutDto);
  }*/

  /* deletes item from user's cart */
  @Delete(':productId')
  removeCartItem(
    @Param('productId', ParseIntPipe) productId: number,
    @GetUser() user: User,
  ): Promise<void | string> {
    return this.cartService.removeCartItem(productId, user);
  }

  /* clears user's cart items */
  @Delete()
  clearCart(
    @GetUser() user: User,
  ): Promise<void> {
    return this.cartService.clearCart(user);
  }

}
