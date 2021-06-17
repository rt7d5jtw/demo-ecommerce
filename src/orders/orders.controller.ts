import { Controller, Param, Get, Post, Body, Req, UsePipes, ValidationPipe, Delete, Query, UseGuards, Headers, UseInterceptors } from '@nestjs/common';
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
import { Request } from 'express';

@Controller('orders')
@UseGuards(AuthGuard())
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  getOrders(
    @Query(ValidationPipe) searchOrdersDto: SearchOrdersDto,
    @GetUser() user: User,
  ): Promise<Order[]> {
    return this.ordersService.getOrders(searchOrdersDto, user);
  }

  @Get('all')
  getAllOrders(
  ): Promise<Order[]> {
    return this.ordersService.getAllOrders();
  }

  @Post('create-payment-intent')
  async addPaymentIntent(
    @Body() paymentDto: PaymentDto,
    @GetUser() user: User,
  ): Promise<Stripe.PaymentIntent> {
    return this.ordersService.addPaymentIntent(paymentDto, user)
  }

  @Post('/pdf')
  @UseInterceptors(InvoiceInterceptor)
  async getInvoice(
    @GetUser() user: User,
  ): Promise<Buffer> {
   return this.ordersService.createInvoice(user)
  }

  @Post('items')
  async addOrderItems(
    @Body() orderIdDto: OrderIdDto,
    @GetUser() user: User,
  ): Promise<OrderItem[]> {
    return this.ordersService.addOrderItems(orderIdDto, user)
  }

  @Get(':id')
  getOrderById(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<Order> {
    return this.ordersService.getOrderById(id, user);
  }

  @Get('/item/:id')
  getOrderItemById(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<OrderItem> {
    return this.ordersService.getOrderItemById(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @GetUser() user: User,
  ): Promise<Order> {
    return this.ordersService.createOrder(createOrderDto, user);
  }

  @Delete(':id')
  deleteOrder(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.ordersService.deleteOrder(id, user);
  }
}
