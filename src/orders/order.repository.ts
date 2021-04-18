import { Order, OrderStatus } from './order.entity';
import { User } from '../users/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/order.do';
import { SearchOrdersDto } from './dto/search-orders.dto';

@EntityRepository(Order)
export class OrderRepository extends Repository<Order> {
  async getOrders(
    searchOrdersDto: SearchOrdersDto,
    user: User,
  ): Promise<Order[]> {
    const { status, search } = searchOrdersDto;
    const query = this.createQueryBuilder('order');

    query.where('order.userId = :userId', { userId: user.id });

    if (status) {
      query.andWhere('order.status = :status', { status });
    }

    if (search) {
      query.andWhere('order.userId LIKE :search OR order.totalprice LIKE :search OR order.address LIKE :search', { search: `%${search}%` });
    }

    const orders = await query.getMany();
    return orders;
  }

  async createOrder(
    createOrderDto: CreateOrderDto,
    user: User,
  ): Promise<Order> {

    const { total_price, address } = createOrderDto;

    const order = new Order();
    order.total_price = total_price;
    order.address = address;
    order.status = OrderStatus.PROCESSING;
    order.user = user;
    await order.save();

    //delete order.user;

    return order;
  }
}
