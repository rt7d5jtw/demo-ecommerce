import { Test } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { User } from '../users/user.entity';
import { Order, OrderStatus } from './order.entity';
import { DeleteResult, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrderItem } from './order-item.entity';
import * as Testdata from '../../test/testdata.json';

jest.mock('pdfkit');

const mockOrderItemRepository = () => ({
  findOne: jest.fn(),
  query: jest.fn(),
  delete: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue({
    innerJoin: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    into: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    execute: jest.fn().mockReturnThis(),
    getRawMany: jest.fn().mockResolvedValue(Testdata.arrayOfOrderItems)
  })
});

const mockOrdersRepository = () => ({
  fetch: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  query: jest.fn().mockResolvedValue(Testdata.arrayOfCartItems),
  createQueryBuilder: jest.fn().mockReturnValue({
    innerJoin: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    getRawMany: jest.fn().mockReturnThis(),
    getMany: jest.fn(() => Testdata.arrayOfOrders)
  }),
  remove: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
  save: jest.fn()
});

describe('OrdersService', () => {
  let ordersService: OrdersService;
  let ordersRepository: Repository<Order>;
  let orderItemRepository: Repository<OrderItem>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useFactory: mockOrdersRepository
        },
        {
          provide: getRepositoryToken(OrderItem),
          useFactory: mockOrderItemRepository
        }
      ]
    }).compile();

    ordersService = module.get<OrdersService>(OrdersService);
    ordersRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
    orderItemRepository = module.get<Repository<OrderItem>>(
      getRepositoryToken(OrderItem)
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockUser = new User();
  mockUser.id = 'e6a23d5f-3a23-498f-9f61-ffb9ad34cb68';
  mockUser.email = 'miumau@gmail.com';
  mockUser.password = 'yeetmageet123';

  describe('fetch', () => {
    it("fetches all user's orders by calling ordersRepository.fetch", async () => {
      expect(await ordersService.fetch(null, mockUser)).toEqual([
        {
          id: expect.any(String),
          user_id: expect.any(String),
          total_price: expect.any(Number),
          address: expect.any(String),
          country: expect.any(String),
          city: expect.any(String),
          postalcode: expect.any(String),
          status: expect.any(String),
          date: expect.any(String)
        },
        {
          id: expect.any(String),
          user_id: expect.any(String),
          total_price: expect.any(Number),
          address: expect.any(String),
          country: expect.any(String),
          city: expect.any(String),
          postalcode: expect.any(String),
          status: expect.any(String),
          date: expect.any(String)
        },
        {
          id: expect.any(String),
          user_id: expect.any(String),
          total_price: expect.any(Number),
          address: expect.any(String),
          country: expect.any(String),
          city: expect.any(String),
          postalcode: expect.any(String),
          status: expect.any(String),
          date: expect.any(String)
        }
      ]);
      expect(ordersRepository.createQueryBuilder).toHaveBeenCalledWith('order');
      expect(ordersRepository.createQueryBuilder().getMany).toHaveBeenCalled();
    });
  });

  describe('fetchById', () => {
    it('returns the user by calling ordersRepository.findOne', async () => {
      const mockOrder = Testdata.arrayOfOrders[0];
      mockOrder.id = 'e6a23d5f-3a23-498f-9f61-ffb9ad34cb68';
      jest
        .spyOn(ordersRepository, 'findOne')
        .mockResolvedValue(mockOrder as unknown as Order);
      expect(
        await ordersService.fetchById(
          'e6a23d5f-3a23-498f-9f61-ffb9ad34cb68',
          mockUser
        )
      ).toEqual({
        id: 'e6a23d5f-3a23-498f-9f61-ffb9ad34cb68',
        user_id: expect.any(String),
        total_price: expect.any(Number),
        address: expect.any(String),
        country: expect.any(String),
        city: expect.any(String),
        postalcode: expect.any(String),
        status: expect.any(String),
        date: expect.any(String)
      });
      expect(ordersRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 'e6a23d5f-3a23-498f-9f61-ffb9ad34cb68',
          user_id: mockUser.id
        }
      });
    });
  });

  describe('fetchAll', () => {
    it('returns all orders from the database by calling ordersRepository.query', async () => {
      jest
        .spyOn(ordersRepository, 'query')
        .mockResolvedValue(Testdata.arrayOfOrders as unknown as Order[]);

      expect(await ordersService.fetchAll()).toEqual([
        {
          id: expect.any(String),
          user_id: expect.any(String),
          total_price: expect.any(Number),
          address: expect.any(String),
          country: expect.any(String),
          city: expect.any(String),
          postalcode: expect.any(String),
          status: expect.any(String),
          date: expect.any(String)
        },
        {
          id: expect.any(String),
          user_id: expect.any(String),
          total_price: expect.any(Number),
          address: expect.any(String),
          country: expect.any(String),
          city: expect.any(String),
          postalcode: expect.any(String),
          status: expect.any(String),
          date: expect.any(String)
        },
        {
          id: expect.any(String),
          user_id: expect.any(String),
          total_price: expect.any(Number),
          address: expect.any(String),
          country: expect.any(String),
          city: expect.any(String),
          postalcode: expect.any(String),
          status: expect.any(String),
          date: expect.any(String)
        }
      ]);

      expect(ordersRepository.query).toHaveBeenCalled();
    });
  });

  /* UNFINISHED ! */
  /*
  describe('createInvoice', () => {
    });
    it(`Creates an invoice by calling ordersRepository.query 
        to get the relevant OrderItems, calls the PDFDocument constructor 
        and calls generateInvoiceInformation and generateInvoiceTable to set inputs 
        for the PDF, calls doc.end to end the stream. Finally emits 'data' events 
        once the listener to the PDFDocument is added and 'end' event to add the buffer.`, async () => {

      // NOTE: The ordersRepository.query adds properties like 
      //       amount which is equivalent to products.price.

      const commonOrderItems = Testdata.arrayOfOrderItems;
      commonOrderItems.forEach((orderItem) => {
        orderItem['amount'] = (Math.random() * (25.5 - 5.5) + 5.5).toFixed(2);
      });

      jest.spyOn(ordersRepository, 'query').mockResolvedValue(commonOrderItems);

      const cr = Testdata.arrayOfOrders[0]; // Common referant
      const order = new Order();
      order.id = cr.id;
      order.user = mockUser;
      order.total_price = cr.total_price;
      order.address = cr.address;
      order.country = cr.country;
      order.postalcode = cr.postalcode;
      order.date = new Date();
      order.status = OrderStatus.PROCESSING;

      expect(ordersService.createInvoice(mockUser, order));

      expect(ordersRepository.query).toHaveBeenCalled();
      expect(PDFDocument).toHaveBeenCalledTimes(1);
    });
  });
  */

  describe('fetchOrderItems', () => {
    it("returns order's items by calling ordersRepository.createQueryBuilder and orderItem.createQueryBuilder", async () => {
      expect(
        await ordersService.fetchOrderItems(
          'f29ca6ae-3aac-4794-b008-4d743901a226'
        )
      ).toEqual([
        {
          order_id: expect.any(String),
          price: expect.any(Number),
          quantity: expect.any(Number),
          title: expect.any(String),
          image: expect.any(String)
        },
        {
          order_id: expect.any(String),
          price: expect.any(Number),
          quantity: expect.any(Number),
          title: expect.any(String),
          image: expect.any(String)
        },
        {
          order_id: expect.any(String),
          price: expect.any(Number),
          quantity: expect.any(Number),
          title: expect.any(String),
          image: expect.any(String)
        },
        {
          order_id: expect.any(String),
          price: expect.any(Number),
          quantity: expect.any(Number),
          title: expect.any(String),
          image: expect.any(String)
        }
      ]);

      expect(orderItemRepository.createQueryBuilder).toHaveBeenCalledWith(
        'order_item'
      );
      expect(
        orderItemRepository.createQueryBuilder().innerJoin
      ).toHaveBeenCalled();
      expect(
        orderItemRepository.createQueryBuilder().select
      ).toHaveBeenCalled();
      expect(orderItemRepository.createQueryBuilder().where).toHaveBeenCalled();
      expect(
        orderItemRepository.createQueryBuilder().getRawMany
      ).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('Creates an order', async () => {
      jest.spyOn(ordersRepository, 'create').mockReturnValue(new Order());

      const dto = {
        total_price: 10,
        address: 'Yeetstreet',
        country: 'Bruma',
        city: 'Yes',
        postalcode: '01000'
      };

      expect(await ordersService.create(dto, mockUser)).toEqual({
        user_id: mockUser.id,
        total_price: 10,
        address: 'Yeetstreet',
        country: 'Bruma',
        date: expect.any(Date),
        city: 'Yes',
        postalcode: '01000',
        status: expect.any(String)
      });

      expect(ordersRepository.create).toHaveBeenCalled();
      expect(ordersRepository.save).toHaveBeenCalled();
      // Call to ordersService.addOrderItems
      expect(ordersRepository.query).toHaveBeenCalled();
      expect(orderItemRepository.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('Update', () => {
    it('calls ordersRepository.findOne and modifies user properties and saves the instance by calling ordersRepository.save', async () => {
      jest.spyOn(ordersRepository, 'findOne').mockResolvedValue({
        id: '725b3c5a-4f40-468e-aa9e-9057600d55af',
        user_id: 'e6a23d5f-3a23-498f-9f61-ffb9ad34cb68',
        total_price: 3,
        address: 'Yeetstreet',
        country: 'Bruma',
        city: 'Yes',
        postalcode: '01000',
        status: OrderStatus.PAID,
        date: new Date('2021-07-23')
      } as Order);

      //ordersService.update = jest
      //  .fn()
      //  .mockImplementation(() => Promise.resolve(mockOrder));
      const dto = {
        status: OrderStatus.PAID
      };
      const id = '725b3c5a-4f40-468e-aa9e-9057600d55af';

      expect(await ordersService.update(dto, id)).toEqual({
        id: expect.any(String),
        user_id: 'e6a23d5f-3a23-498f-9f61-ffb9ad34cb68',
        address: 'Yeetstreet',
        country: 'Bruma',
        city: 'Yes',
        total_price: 3,
        postalcode: '01000',
        status: 'PAID',
        date: expect.any(Date)
      });

      expect(ordersRepository.findOne).toHaveBeenCalledWith({
        where: { id: id }
      });
      expect(ordersRepository.save).toHaveBeenCalled();
    });
  });

  describe('removeOrder', () => {
    it('Removes an order by calling ordersRepository.findOne to get the Order by the specified ID and calls orderItemRepository.delete to delete the orderItems, then finally calls ordersRepository.delete to remove the Order itself.', async () => {
      const deleteResult = new DeleteResult();
      deleteResult.affected = 1;

      // To have a common referant
      const commonOrder = Testdata.arrayOfOrders[0] as unknown as Order;
      jest.spyOn(ordersRepository, 'findOne').mockResolvedValue(commonOrder);
      jest.spyOn(ordersRepository, 'delete').mockResolvedValue(deleteResult);

      await ordersService.removeOrder(commonOrder['id']);
      expect(ordersRepository.findOne).toHaveBeenCalledWith({
        where: { id: commonOrder['id'] }
      });
      expect(orderItemRepository.delete).toHaveBeenCalledWith({
        order_id: commonOrder['id']
      });
      expect(ordersRepository.delete).toHaveBeenCalledWith(commonOrder['id']);
    });
  });
});
