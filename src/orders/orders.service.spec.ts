import { Test } from '@nestjs/testing';
import { MockType } from '../category/category.service.spec';
import { OrdersService } from './orders.service';
import { User } from '../users/user.entity';
import { bunchOfOrders } from './orders.controller.spec';
import { OrdersRepositoryExtended } from './orders.repository';
import { Order, OrderStatus } from './order.entity';
import { v4 as uuid } from 'uuid';
import * as typeorm from 'typeorm';
import { createStubInstance, createSandbox } from 'sinon';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

const mockOrdersRepository: () => MockType<Repository<Order>> = jest.fn(() => ({
  fetch: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  query: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue({
    innerJoin: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    getRawMany: jest.fn().mockReturnThis(),
  }),
  remove: jest.fn(),
  createOrder: jest.fn((dto, user) => {
    dto.id = uuid();
    dto.status = OrderStatus.PROCESSING;
    dto.userId = user.id;
    dto.total_price = dto.total_price.toString();
    dto.date = new Date().toString();
    return Promise.resolve(dto);
  }),
  delete: jest.fn(),
  save: jest.fn(),
}));

describe('OrdersService', () => {
  let ordersService: OrdersService;
  let ordersRepository: Repository<Order> & OrdersRepositoryExtended;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useFactory: mockOrdersRepository,
        },
      ],
    }).compile();

    ordersService = module.get<OrdersService>(OrdersService);
    ordersRepository = module.get<Repository<Order> & OrdersRepositoryExtended>(
      getRepositoryToken(Order)
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
      jest.spyOn(ordersRepository, 'fetch').mockResolvedValue(bunchOfOrders as Order[]);
      expect(await ordersService.fetch(null, mockUser)).toEqual([
        {
          id: expect.any(String),
          userId: expect.any(String),
          total_price: expect.any(Number),
          address: expect.any(String),
          country: expect.any(String),
          city: expect.any(String),
          postalcode: expect.any(String),
          status: expect.any(String),
          date: expect.any(String),
        },
        {
          id: expect.any(String),
          userId: expect.any(String),
          total_price: expect.any(Number),
          address: expect.any(String),
          country: expect.any(String),
          city: expect.any(String),
          postalcode: expect.any(String),
          status: expect.any(String),
          date: expect.any(String),
        },
        {
          id: expect.any(String),
          userId: expect.any(String),
          total_price: expect.any(Number),
          address: expect.any(String),
          country: expect.any(String),
          city: expect.any(String),
          postalcode: expect.any(String),
          status: expect.any(String),
          date: expect.any(String),
        },
      ]);
      expect(ordersRepository.fetch).toHaveBeenCalledWith(null, mockUser);
    });
  });

  describe('fetchById', () => {
    it('returns the user by calling ordersRepository.findOne', async () => {
      const mockOrder = bunchOfOrders[0];
      mockOrder.id = 'e6a23d5f-3a23-498f-9f61-ffb9ad34cb68';
      jest.spyOn(ordersRepository, 'findOne').mockResolvedValue(mockOrder as Order);
      expect(
        await ordersService.fetchById('e6a23d5f-3a23-498f-9f61-ffb9ad34cb68', mockUser)
      ).toEqual({
        id: 'e6a23d5f-3a23-498f-9f61-ffb9ad34cb68',
        userId: expect.any(String),
        total_price: expect.any(Number),
        address: expect.any(String),
        country: expect.any(String),
        city: expect.any(String),
        postalcode: expect.any(String),
        status: expect.any(String),
        date: expect.any(String),
      });
      expect(ordersRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'e6a23d5f-3a23-498f-9f61-ffb9ad34cb68', userId: mockUser.id },
      });
    });
  });

  describe('fetchAll', () => {
    it('returns all orders from the database by calling ordersRepository.query', async () => {
      jest.spyOn(ordersRepository, 'query').mockResolvedValue(bunchOfOrders as Order[]);
      expect(await ordersService.fetchAll()).toEqual([
        {
          id: expect.any(String),
          userId: expect.any(String),
          total_price: expect.any(Number),
          address: expect.any(String),
          country: expect.any(String),
          city: expect.any(String),
          postalcode: expect.any(String),
          status: expect.any(String),
          date: expect.any(String),
        },
        {
          id: expect.any(String),
          userId: expect.any(String),
          total_price: expect.any(Number),
          address: expect.any(String),
          country: expect.any(String),
          city: expect.any(String),
          postalcode: expect.any(String),
          status: expect.any(String),
          date: expect.any(String),
        },
        {
          id: expect.any(String),
          userId: expect.any(String),
          total_price: expect.any(Number),
          address: expect.any(String),
          country: expect.any(String),
          city: expect.any(String),
          postalcode: expect.any(String),
          status: expect.any(String),
          date: expect.any(String),
        },
      ]);
      expect(ordersRepository.query).toHaveBeenCalled();
    });
  });

  describe('fetchOrderItems', () => {
    const sandbox = createSandbox();
    beforeEach(() => {
      sandbox.stub(typeorm.ConnectionManager.prototype, 'get').returns({
        getRepository: sandbox.stub().returns({
          Repository: createStubInstance(Repository),
          createQueryBuilder: () => ({
            select: jest.fn().mockReturnThis(),
            innerJoin: jest.fn().mockReturnThis(),
            leftJoin: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            getRawMany: jest.fn().mockReturnValue(mockOrderItems),
          }),
        }),
      } as unknown as typeorm.Connection);
    });

    afterEach(() => {
      sandbox.restore();
    });

    const mockOrderItems = [
      {
        orderId: '96a94bbc-c18c-41a0-94c7-77320815c577',
        price: 5.5,
        quantity: 1,
        productId: 41,
        title: 'Chocolate Chip Cookies',
        image: 'cookies.jpg',
      },
      {
        orderId: '96a94bbc-c18c-41a0-94c7-77320815c577',
        price: 3.5,
        quantity: 1,
        productId: 42,
        title: 'Raspberry Chocolate',
        image: 'raspberry.jpg',
      },
      {
        orderId: '96a94bbc-c18c-41a0-94c7-77320815c577',
        price: 7.5,
        quantity: 1,
        productId: 46,
        title: 'Chocolate Balls',
        image: 'round.jpg',
      },
      {
        orderId: '96a94bbc-c18c-41a0-94c7-77320815c577',
        price: 3.75,
        quantity: 1,
        productId: 48,
        title: 'Wheat Cream Biscuits',
        image: 'cremebiscuits.jpg',
      },
    ];
    it("returns order's items by calling ordersRepository.createQueryBuilder and orderItem.createQueryBuilder", async () => {
      expect(await ordersService.fetchOrderItems('f29ca6ae-3aac-4794-b008-4d743901a226')).toEqual([
        {
          orderId: expect.any(String),
          price: expect.any(Number),
          quantity: expect.any(Number),
          productId: expect.any(Number),
          title: expect.any(String),
          image: expect.any(String),
        },
        {
          orderId: expect.any(String),
          price: expect.any(Number),
          quantity: expect.any(Number),
          productId: expect.any(Number),
          title: expect.any(String),
          image: expect.any(String),
        },
        {
          orderId: expect.any(String),
          price: expect.any(Number),
          quantity: expect.any(Number),
          productId: expect.any(Number),
          title: expect.any(String),
          image: expect.any(String),
        },
        {
          orderId: expect.any(String),
          price: expect.any(Number),
          quantity: expect.any(Number),
          productId: expect.any(Number),
          title: expect.any(String),
          image: expect.any(String),
        },
      ]);
    });
  });

  describe('create', () => {
    it('creates an order by calling ordersRepository.createOrder', async () => {
      const dto = {
        total_price: 10,
        address: 'Yeetstreet',
        country: 'Bruma',
        city: 'Yes',
        postalcode: '01000',
      };
      expect(await ordersService.create(dto, mockUser)).toEqual({
        id: expect.any(String),
        userId: mockUser.id,
        total_price: '10',
        address: 'Yeetstreet',
        country: 'Bruma',
        city: 'Yes',
        postalcode: '01000',
        status: expect.any(String),
        date: expect.any(String),
      });
      expect(ordersRepository.createOrder).toHaveBeenCalledWith(dto, mockUser);
    });
  });

  describe('update', () => {
    const mockOrder = {
      id: '725b3c5a-4f40-468e-aa9e-9057600d55af',
      userId: 'e6a23d5f-3a23-498f-9f61-ffb9ad34cb68',
      status: 'PAID',
      date: '2021-07-23',
    };
    it('calls ordersRepository.findOne and modifies user properties and saves the instance', async () => {
      jest.spyOn(ordersRepository, 'findOne').mockResolvedValue({
        id: '725b3c5a-4f40-468e-aa9e-9057600d55af',
        userId: 'e6a23d5f-3a23-498f-9f61-ffb9ad34cb68',
        total_price: 3,
        address: 'Yeetstreet',
        country: 'Bruma',
        city: 'Yes',
        postalcode: '01000',
        status: OrderStatus.PAID,
        date: new Date('2021-07-23'),
      } as Order);

      ordersService.update = jest.fn().mockImplementation(() => Promise.resolve(mockOrder));
      const dto = {
        status: OrderStatus.PAID,
      };
      const id = '725b3c5a-4f40-468e-aa9e-9057600d55af';
      expect(await ordersService.update(dto, id)).toEqual({
        id: expect.any(String),
        userId: 'e6a23d5f-3a23-498f-9f61-ffb9ad34cb68',
        status: 'PAID',
        date: '2021-07-23',
      });
    });
  });
});
