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
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CartService } from './cart.service';
import { CartItemInfo } from './dto/cart.dto';
import { CartItem } from './cart-item.entity';
import { Cart } from './cart.entity';
import { GetUser } from '../users/get_user.decorator';
import { User } from '../users/user.entity';
import { DeleteResult, InsertResult } from 'typeorm';

// NOTE: The methods utilize 'Authorization Bearer <JWT>' to fetch the User from the jwt.
@Controller('cart')
@UseGuards(AuthGuard('jwt'))
export class CartController {
  constructor(private cartService: CartService) {}

  // Get Cart of the User.
  @Get()
  fetchCart(@GetUser() user: User): Promise<Cart> {
    return this.cartService.fetchCart(user);
  }

  // Fetches cart items with corresponding product title,
  // image and product_id and without cart_id, id, and date.
  @Get('/items')
  fetchCartItems(@GetUser() user: User): Promise<CartItemInfo> {
    return this.cartService.fetchCartItems(user);
  }

  //  Get Product's price.
  @Get('/product/:id')
  fetchProductPrice(@Param('id', ParseIntPipe) id: number): Promise<number> {
    return this.cartService.fetchProductPrice(id);
  }

  // Creates the cart for the User.
  @Post()
  @UsePipes(ValidationPipe)
  createCart(@GetUser() user: User): Promise<Cart> {
    return this.cartService.createCart(user);
  }

  // Handles multiple Products being added to the CartItem table for the User.
  @Post('batch')
  batchAddProducts(
    @GetUser() user: User,
    @Body() productIDArray: Array<number>
  ): Promise<InsertResult> {
    return this.cartService.batchAddProducts(productIDArray, user);
  }

  // Handles a single Product by ID specified in the
  // URI as a parameter and adds it to the CartItem table.
  @Post(':id')
  @UsePipes(ValidationPipe)
  addToCart(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
    @Body() qty: { quantity: number }
  ): Promise<CartItem> {
    return this.cartService.addToCart(id, user, qty);
  }

  // Removes User's Cart and cascades to all the CartItem's.
  // (This Removes the entire Cart row from the Cart table).
  @Delete('remove')
  removeCart(@GetUser() user: User): Promise<DeleteResult> {
    return this.cartService.removeCart(user);
  }

  // Deletes item from User's Cart.
  @Delete(':productId')
  removeCartItem(
    @Param('productId', ParseIntPipe) productId: number,
    @GetUser() user: User
  ): Promise<DeleteResult> {
    return this.cartService.removeCartItem(productId, user);
  }

  // Clears user's CartItem's.
  @Delete()
  clearCart(@GetUser() user: User): Promise<DeleteResult> {
    return this.cartService.clearCart(user);
  }
}
