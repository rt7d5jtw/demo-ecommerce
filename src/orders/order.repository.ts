import { Order, OrderStatus } from './order.entity';
import { User } from '../users/user.entity';
import { EntityRepository, getManager, getRepository, Repository } from 'typeorm';
import { CreateOrderDto, OrderIdDto, OrderItemDto } from './dto/order.do';
import { SearchOrdersDto } from './dto/search-orders.dto';
import { generateInvoiceInformation, generateInvoiceTable } from './invoice';
import { OrderItem } from './order-item.entity';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';

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

  async createInvoice(
    user: User,
  ): Promise<Buffer> {
  const invoice = {
    shipping: {
      name: "I eat ass",
      address: "1234 Main Street",
      city: "San Francisco",
      state: "CA",
      country: "US",
      postal_code: 94111
    },
    items: [
      {
        item: "TC 100",
        description: "Toner Cartridge",
        productId: 1,
        quantity: 2,
        amount: 6000
      },
      {
        item: "USB_EXT",
        description: "USB Cable Extender",
        productId: 2,
        quantity: 1,
        amount: 2000
      }
    ],
    subtotal: 8000,
    paid: 0,
    invoice_nr: 1234
  };

    const pdfBuffer: Buffer = await new Promise(resolve => {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
        bufferPages: true,
      })
      let path = 'stuff.pdf'

      // customize your PDF document
      generateInvoiceInformation(doc, invoice)
      generateInvoiceTable(doc, invoice)
      doc.pipe(fs.createWriteStream(path));
      doc.end()

      const buffer = []
      doc.on('data', buffer.push.bind(buffer))
      doc.on('end', () => {
        const data = Buffer.concat(buffer)
        resolve(data)
      })
    })
    return pdfBuffer
  }

  async createOrder(
    createOrderDto: CreateOrderDto,
    user: User,
  ): Promise<Order> {

    const { total_price, address, country, city, postalcode } = createOrderDto;

    const order = new Order();
    order.total_price = total_price;
    order.address = address;
    order.country = country;
    order.city = city;
    order.postalcode = postalcode;
    order.status = OrderStatus.PROCESSING;
    order.user = user;

    await order.save();
    delete order.user;

    this.addOrderItems({ orderId: order.id }, user)

   return order;
  }

  async addOrderItems(
    orderIdDto: OrderIdDto,
    user: User,
  ): Promise<OrderItem[]> {

    const orderItem = new OrderItem();

    /* get cartId */
    const userId = user["id"];
    const manager = getManager();
    const cartId = await manager.query(`
      SELECT id FROM "cart" as cart
      WHERE cart."userId" = '${userId}';
      `)

    const cartItems = await manager.query(`
      SELECT * FROM "cart-item" as ct
      WHERE ct."cartId" = '${cartId[0].id}';
      `)

    for (let i = 0; i < cartItems.length; i++) {
      orderItem.orderId = orderIdDto.orderId;
      orderItem.price = cartItems[i].price;
      orderItem.quantity = cartItems[i].quantity;
      orderItem.product = cartItems[i].productId;
      orderItem.save();
    }
    return cartItems;
  }
}
