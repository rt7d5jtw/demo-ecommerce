import {
  Controller,
  Param,
  Get,
  Post,
  Body,
  Req,
  UsePipes,
  ValidationPipe,
  Delete,
  Query,
  UseGuards,
  Headers,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateOrderDto, OrderIdDto, OrderItemDto } from './dto/order.do';
import { SearchOrdersDto } from './dto/search-orders.dto';
import { OrdersService } from './orders.service';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { User, UserRole } from '../users/user.entity';
import { GetUser } from '../users/get_user.decorator';
import { Roles } from 'src/users/roles.decorator';
import { InvoiceInterceptor } from './invoice.interceptor';
import { PaymentDto } from './dto/payment.dto';
import Stripe from 'stripe';
import { Request, Response } from 'express';

@Controller('orders')
@UseGuards(AuthGuard())
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  getOrders(
    @Query(ValidationPipe) searchOrdersDto: SearchOrdersDto,
    @GetUser() user: User
  ): Promise<Order[]> {
    return this.ordersService.getOrders(searchOrdersDto, user);
  }

  @Get('all')
  getAllOrders(): Promise<Order[]> {
    return this.ordersService.getAllOrders();
  }

  @Post('create-payment-intent')
  async addPaymentIntent(
    @Body() paymentDto: PaymentDto,
    @GetUser() user: User
  ): Promise<Stripe.PaymentIntent> {
    return this.ordersService.addPaymentIntent(paymentDto, user);
  }

  @Post('/pdf')
  //@UseInterceptors(InvoiceInterceptor)
  async getInvoice(
    @GetUser() user: User,
    @Body() orderId: string,
    @Res() res: Response
  ): Promise<any> {
    const order = await this.ordersService.getOrderById(orderId['orderId'], user);
    const buffer = await this.ordersService.createInvoice(user, order);
    const stream = await this.ordersService.getReadableStream(buffer);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment',
      'Content-Length': buffer.length,
      filename: 'invoice.pdf',
    });

    stream.pipe(res);
  }

  @Post('items/:id')
  async addOrderItems(@Param('id') id: string, @GetUser() user: User): Promise<OrderItem[]> {
    return this.ordersService.addOrderItems(id, user);
  }

  @Get(':id')
  getOrderById(@Param('id') id: string, @GetUser() user: User): Promise<Order> {
    return this.ordersService.getOrderById(id, user);
  }

  @Get('/items/:id')
  getOrderItemById(@Param('id') id: string, @GetUser() user: User): Promise<OrderItem[]> {
    return this.ordersService.getOrderItemById(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createOrder(@Body() createOrderDto: CreateOrderDto, @GetUser() user: User): Promise<Order> {
    return this.ordersService.createOrder(createOrderDto, user);
  }

  @Delete(':id')
  deleteOrder(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    return this.ordersService.deleteOrder(id, user);
  }
}
