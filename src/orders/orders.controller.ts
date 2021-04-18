import { Controller, Param, Get, Post, Body, UsePipes, ValidationPipe, Delete, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateOrderDto } from './dto/order.do';
import { SearchOrdersDto } from './dto/search-orders.dto';
import { OrdersService } from './orders.service';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { User } from '../users/user.entity';
import { GetUser } from '../users/get_user.decorator';

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
