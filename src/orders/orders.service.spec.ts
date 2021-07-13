import { Test } from '@nestjs/testing';
import { MockType } from '../category/category.service.spec';
import { OrdersService } from './orders.service';
import { User } from '../users/user.entity';
import { bunchOfOrders } from './orders.controller.spec';
import { OrdersRepository } from './orders.repository';
import { OrderStatus } from './order.entity';
import { v4 as uuid } from 'uuid';
import * as typeorm from 'typeorm';
import { OrderItem } from './order-item.entity';

const mockOrdersRepository: () => MockType<OrdersRepository> = jest.fn(() => ({
  fetch: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  query: jest.fn(),
  createQueryBuilder: jest.fn(),
  remove: jest.fn(),
  createOrder: jest.fn((dto, user) => {
    dto.id = uuid();
    dto.status = OrderStatus.PROCESSING;
    dto.userId = user.id;
    dto.total_price = dto.total_price.toString();
    dto.date = new Date().toString();
    return Promise.resolve(dto);
  }),
}));

const orderItems = [
  {
    id: 'b6bc6594-c808-45fc-bbdb-2d0d32292f6e',
    orderId: 'f29ca6ae-3aac-4794-b008-4d743901a226',
    price: 9.5,
    quantity: 1,
  },
  {
    id: '7754c980-0e07-4505-82b6-d887bcaf8221',
    orderId: 'f29ca6ae-3aac-4794-b008-4d743901a226',
    price: 1.5,
    quantity: 1,
  },
];

describe('OrdersService', () => {
  let ordersService: OrdersService;
  let ordersRepository: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [OrdersService, { provide: OrdersRepository, useFactory: mockOrdersRepository }],
    }).compile();

    ordersService = module.get<OrdersService>(OrdersService);
    ordersRepository = module.get<OrdersRepository>(OrdersRepository);
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
      ordersRepository.fetch.mockResolvedValue(bunchOfOrders);
      await expect(ordersService.fetch(null, mockUser)).resolves.toEqual([
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
      ordersRepository.findOne.mockResolvedValue(mockOrder);
      await expect(
        ordersService.fetchById('e6a23d5f-3a23-498f-9f61-ffb9ad34cb68', mockUser)
      ).resolves.toEqual({
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
      ordersRepository.query.mockResolvedValue(bunchOfOrders);
      await expect(ordersService.fetchAll()).resolves.toEqual([
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

  /*
  describe('fetchOrderItems', () => {
    it("returns order's items by calling ordersRepository.createQueryBuilder and orderItem.createQueryBuilder", async () => {
      ordersRepository.createQueryBuilder = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockReturnValue(bunchOfOrders[0]),
      });
      getRepository(OrderItem).createQueryBuilder = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockReturnValue(orderItems),
      });
      expect(
        ordersService.fetchOrderItems('f29ca6ae-3aac-4794-b008-4d743901a226', mockUser)
      ).resolves.toEqual([
        {
          id: expect.any(String),
          orderId: 'f29ca6ae-3aac-4794-b008-4d743901a226',
          price: expect.any(Number),
          quantity: expect.any(Number),
        },
        {
          id: expect.any(String),
          orderId: 'f29ca6ae-3aac-4794-b008-4d743901a226',
          price: expect.any(Number),
          quantity: expect.any(Number),
        },
      ]);
    });
  });
  */

  describe('create', () => {
    it('creates an order by calling ordersRepository.createOrder', async () => {
      const dto = {
        total_price: 10,
        address: 'Yeetstreet',
        country: 'Bruma',
        city: 'Yes',
        postalcode: '01000',
      };
      await expect(ordersService.create(dto, mockUser)).resolves.toEqual({
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

  /*
  describe('removeOrder', () => {
    it('calls ordersRepository.find and uses orderItemRepository.delete to delete items associated with the order along with the order', async () => {
      spyOn(typeorm, 'getRepository');
      //const orderRepo = typeorm.getRepository(OrderItem);
      //orderRepo.delete = jest.fn().mockReturnValue({ affected: 1 });

      ordersRepository.find.mockResolvedValue(bunchOfOrders[0]);
      expect(ordersService.removeOrder('f29ca6ae-3aac-4794-b008-4d743901a226', mockUser));
    });
  });
  */
});
