import {
  Controller,
  Get,
  Body,
  Param,
  Post,
  Delete,
  ValidationPipe,
  UsePipes,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CartService } from './cart.service';
import { CartItemInfo } from './dto/cart.dto';
import { CartItem } from './cart-item.entity';
import { Cart } from './cart.entity';
import { GetUser } from '../users/get_user.decorator';
import { User } from '../users/user.entity';

// NOTE: The methods utilize 'Authorization Bearer <JWT>' to fetch the User from the jwt.
@Controller('cart')
@UseGuards(AuthGuard('jwt'))
export class CartController {
  constructor(private cartService: CartService) {}

  /* get cart of the user*/
  @Get()
  fetchCart(@GetUser() user: User): Promise<Cart> {
    return this.cartService.fetchCart(user);
  }

  /* fetches cart items with corresponding product title,
   * image and productId and without cartId, Id, and date */
  @Get('/items')
  fetchCartItems(@GetUser() user: User): Promise<CartItemInfo> {
    return this.cartService.fetchCartItems(user);
  }

  /* get product's price */
  @Get('/product/:id')
  fetchProductPrice(@Param('id', ParseIntPipe) id: number): Promise<number> {
    return this.cartService.fetchProductPrice(id);
  }

  /* creates the cart for the user */
  @Post()
  @UsePipes(ValidationPipe)
  createCart(@GetUser() user: User): Promise<Cart> {
    return this.cartService.createCart(user);
  }

  /* puts a product in the cart */
  @Post(':id')
  @UsePipes(ValidationPipe)
  addToCart(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
    @Body() qty: { quantity: number }
  ): Promise<CartItem> {
    return this.cartService.addToCart(id, user, qty);
  }

  /* deletes item from user's cart */
  @Delete(':productId')
  removeCartItem(
    @Param('productId', ParseIntPipe) productId: number,
    @GetUser() user: User
  ): Promise<void | string> {
    return this.cartService.removeCartItem(productId, user);
  }

  /* clears user's cart items */
  @Delete()
  clearCart(@GetUser() user: User): Promise<any> {
    return this.cartService.clearCart(user);
  }
}
