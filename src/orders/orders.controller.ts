import {
  Controller,
  Param,
  Get,
  Res,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Delete,
  Query,
  UseGuards,
  Patch,
  ParseUUIDPipe
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateOrderDto, UpdateOrderDto } from './dto/order.do';
import { SearchOrdersDto } from './dto/search-orders.dto';
import { OrdersService } from './orders.service';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { User } from '../users/user.entity';
import { GetUser } from '../users/get_user.decorator';
import { PaymentDto } from './dto/payment.dto';
import { Response } from 'express';
import Stripe from 'stripe';
import { Product } from '../product/product.entity';

@UseGuards(AuthGuard('jwt'))
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  fetch(
    @Query(ValidationPipe) searchOrdersDto: SearchOrdersDto,
    @GetUser() user: User
  ): Promise<Order[]> {
    return this.ordersService.fetch(searchOrdersDto, user);
  }

  @Get('all')
  fetchAll(): Promise<Order[]> {
    return this.ordersService.fetchAll();
  }

  @Post('create-payment-intent')
  async addPaymentIntent(
    @Body() paymentDto: PaymentDto
  ): Promise<Stripe.PaymentIntent> {
    return this.ordersService.addPaymentIntent(paymentDto);
  }

  @Post('/pdf')
  async getInvoice(
    @GetUser()
    user: User,
    @Body() orderId: string,
    @Res() res: Response
  ): Promise<any> {
    const order = await this.ordersService.fetchById(orderId['orderId'], user);
    const buffer = await this.ordersService.createInvoice(user, order);
    const stream = await this.ordersService.getReadableStream(buffer);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment',
      'Content-Length': buffer.length,
      filename: 'invoice.pdf'
    });

    stream.pipe(res);
  }

  @Post('items/:id')
  async addOrderItems(
    @Param('id') id: string,
    @GetUser() user: User
  ): Promise<OrderItem[]> {
    return this.ordersService.addOrderItems(id, user);
  }

  @Get(':id')
  fetchById(@Param('id') id: string, @GetUser() user: User): Promise<Order> {
    return this.ordersService.fetchById(id, user);
  }

  @Get('/items/:id')
  fetchOrderItems(
    @Param('id') id: string
  ): Promise<(OrderItem & Pick<Product, 'title' | 'image'>)[]> {
    return this.ordersService.fetchOrderItems(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  create(
    @Body() createOrderDto: CreateOrderDto,
    @GetUser() user: User
  ): Promise<Order> {
    return this.ordersService.create(createOrderDto, user);
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto
  ): Promise<Order> {
    return this.ordersService.update(updateOrderDto, id);
  }

  @Delete(':id')
  removeOrder(@Param('id') id: string): Promise<void> {
    return this.ordersService.removeOrder(id);
  }
}
