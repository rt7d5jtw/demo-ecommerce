import { Test } from '@nestjs/testing';
import { v4 as uuid } from 'uuid';
import { User } from '../users/user.entity';
import { OrderStatus } from './order.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Readable } from 'stream';
import * as Testdata from '../../test/testdata.json';

const mockOrdersService = () => ({
  fetch: jest.fn().mockResolvedValue(Testdata.arrayOfOrders),
  fetchAll: jest.fn().mockResolvedValue(Testdata.arrayOfOrders),
  fetchById: jest.fn().mockResolvedValue(Testdata.arrayOfOrders[0]),
  fetchOrderItems: jest.fn().mockResolvedValue(Testdata.arrayOfOrders[0]),
  addOrderItems: jest.fn().mockResolvedValue(Testdata.arrayOfCartItems),
  removeOrder: jest.fn().mockResolvedValue(undefined),
  update: jest.fn(),
  create: jest.fn((dto, user) => {
    dto.id = uuid();
    dto.status = OrderStatus.PROCESSING;
    dto.user_id = user.id;
    dto.total_price = dto.total_price.toString();
    dto.date = new Date().toString();
    return Promise.resolve(dto);
  }),
  createInvoice: jest.fn().mockResolvedValue(Buffer.from('I like chocolate')),
  getReadableStream: jest.fn(() => {
    const buffer = Buffer.from('I like chocolate');
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
  })
});

describe('OrdersController', () => {
  let ordersController: OrdersController;
  let ordersService: any;

  jest.mock('stream');
  jest.mock('jest-mock-req-res');

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useFactory: mockOrdersService
        }
      ]
    }).compile();

    ordersController = module.get<OrdersController>(OrdersController);
    ordersService = module.get<OrdersService>(OrdersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockUser = new User();
  mockUser.email = 'miumau@gmail.com';
  mockUser.password =
    '$2b$10$ZUYZVMqZgk5zDj2wQVdpQ.OQuncE7TauJSFlK7vLdQOfjnrqZNXrm';
  mockUser.id = '5712e711-9c52-436f-854e-0d63691547c8';

  describe('fetch', () => {
    it("fetches user's orders by calling ordersService", async () => {
      await expect(ordersController.fetch(null, mockUser)).resolves.toEqual([
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
      expect(ordersService.fetch).toHaveBeenCalled();
    });
  });

  describe('fetchAll', () => {
    it('fetches all orders in the database by calling ordersService', async () => {
      await expect(ordersController.fetchAll()).resolves.toEqual(
        Testdata.arrayOfOrders
      );
      expect(ordersService.fetchAll).toHaveBeenCalled();
    });
  });

  describe('fetchById', () => {
    it("fetches order's items by calling ordersService", async () => {
      await expect(
        ordersController.fetchById(
          'f29ca6ae-3aac-4794-b008-4d743901a226',
          mockUser
        )
      ).resolves.toEqual({
        id: 'f29ca6ae-3aac-4794-b008-4d743901a226',
        user_id: expect.any(String),
        total_price: expect.any(Number),
        address: expect.any(String),
        country: expect.any(String),
        city: expect.any(String),
        postalcode: expect.any(String),
        status: expect.any(String),
        date: expect.any(String)
      });
      expect(ordersService.fetchById).toHaveBeenCalledWith(
        'f29ca6ae-3aac-4794-b008-4d743901a226',
        mockUser
      );
    });
  });

  describe('fetchOrderItems', () => {
    it("fetches order's items by calling ordersService", async () => {
      await expect(
        ordersController.fetchOrderItems('f29ca6ae-3aac-4794-b008-4d743901a226')
      ).resolves.toEqual({
        id: 'f29ca6ae-3aac-4794-b008-4d743901a226',
        user_id: expect.any(String),
        total_price: expect.any(Number),
        address: expect.any(String),
        country: expect.any(String),
        city: expect.any(String),
        postalcode: expect.any(String),
        status: expect.any(String),
        date: expect.any(String)
      });
      expect(ordersService.fetchOrderItems).toHaveBeenCalledWith(
        'f29ca6ae-3aac-4794-b008-4d743901a226'
      );
    });
  });

  describe('addOrderItems', () => {
    it("adds items in user's cart to order with specified id", async () => {
      expect(
        await ordersController.addOrderItems(
          'f29ca6ae-3aac-4794-b008-4d743901a226',
          mockUser
        )
      ).toEqual([
        {
          id: expect.any(String),
          cart_id: expect.any(String),
          product_id: expect.any(Number),
          quantity: expect.any(Number),
          price: expect.any(Number),
          created_at: expect.any(String)
        },
        {
          id: expect.any(String),
          cart_id: expect.any(String),
          product_id: expect.any(Number),
          quantity: expect.any(Number),
          price: expect.any(Number),
          created_at: expect.any(String)
        }
      ]);
      expect(ordersService.addOrderItems).toHaveBeenCalledWith(
        'f29ca6ae-3aac-4794-b008-4d743901a226',
        mockUser
      );
    });
  });

  describe('create', () => {
    it('creates an order by calling ordersService and returns the order', async () => {
      const dto = {
        total_price: 10,
        address: 'Yeetstreet',
        country: 'Bruma',
        city: 'Yes',
        postalcode: '01000'
      };
      await expect(ordersController.create(dto, mockUser)).resolves.toEqual({
        total_price: '10',
        address: 'Yeetstreet',
        country: 'Bruma',
        city: 'Yes',
        postalcode: '01000',
        status: 'PROCESSING',
        user_id: '5712e711-9c52-436f-854e-0d63691547c8',
        id: expect.any(String),
        date: expect.any(String)
      });
      expect(ordersService.create).toHaveBeenCalledWith(dto, mockUser);
    });
  });

  describe('update', () => {
    it('updates the order by calling ordersService', async () => {
      ordersService.update.mockResolvedValue({
        id: '725b3c5a-4f40-468e-aa9e-9057600d55af',
        user_id: 'e6a23d5f-3a23-498f-9f61-ffb9ad34cb68',
        total_price: '10',
        address: 'Yeetstreet',
        country: 'Bruma',
        city: 'Yes',
        postalcode: '01000',
        status: 'PAID',
        date: '2021-07-23'
      });
      const dto = {
        total_price: 10,
        address: 'Yeetstreet',
        country: 'Bruma',
        city: 'Yes',
        postalcode: '01000',
        status: OrderStatus.PAID
      };
      const id = '725b3c5a-4f40-468e-aa9e-9057600d55af';
      expect(ordersController.update(id, dto)).resolves.toEqual({
        id: '725b3c5a-4f40-468e-aa9e-9057600d55af',
        user_id: 'e6a23d5f-3a23-498f-9f61-ffb9ad34cb68',
        total_price: '10',
        address: 'Yeetstreet',
        country: 'Bruma',
        city: 'Yes',
        postalcode: '01000',
        status: 'PAID',
        date: '2021-07-23'
      });
    });
  });

  describe('removeOrder', () => {
    it('removes order by calling ordersService', async () => {
      await expect(
        ordersController.removeOrder('f29ca6ae-3aac-4794-b008-4d743901a226')
      ).resolves.toBeUndefined();
      expect(ordersService.removeOrder).toHaveBeenCalledWith(
        'f29ca6ae-3aac-4794-b008-4d743901a226'
      );
    });
  });
});
