import { Test } from '@nestjs/testing';
import { User } from '../users/user.entity';
import { Order, OrderStatus } from './order.entity';
import { bunchOfOrders } from './orders.controller.spec';
import { OrdersRepository } from './orders.repository';
import * as typeorm from 'typeorm';
import { stub } from 'sinon';

const cartItems = [
  {
    id: '97d6fb24-3c64-454c-bec0-113aa5e583a8',
    cartId: '98ae6c5e-b762-4921-b867-dbf297d6200d',
    productId: 28,
    quantity: 1,
    price: 9.5,
    CreatedAt: '2021-07-15',
  },
  {
    id: '49ff2d34-f2a1-4a0a-ae1c-0c2b5065c653',
    cartId: '98ae6c5e-b762-4921-b867-dbf297d6200d',
    productId: 25,
    quantity: 1,
    price: 7,
    CreatedAt: '2021-07-15',
  },
];

describe('OrdersRepository', () => {
  let ordersRepository: OrdersRepository;
  let connection: any;

  /* mocked connection for the repository */
  let mockConnection = () => ({
    transaction: jest.fn(),
    query: jest.fn(),
    manager: jest.fn().mockReturnValue({
      query: jest.fn().mockReturnValue('i eat chocolate'),
    }),
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      /* injects the fake connection to typeorm.Connection */
      providers: [OrdersRepository, { provide: typeorm.Connection, useFactory: mockConnection }],
    }).compile();

    ordersRepository = module.get<OrdersRepository>(OrdersRepository);
    connection = module.get<typeorm.Connection>(typeorm.Connection);
  });
  jest.mock('../users/user.entity');

  const mockUser = new User();
  mockUser.id = 'e6a23d5f-3a23-498f-9f61-ffb9ad34cb68';
  mockUser.email = 'miumau@gmail.com';
  mockUser.password = 'yeetmageet123';

  describe('fetch', () => {
    beforeEach(() => {
      jest.spyOn(typeorm.Repository.prototype, 'createQueryBuilder').mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockReturnValue(bunchOfOrders),
      } as unknown as typeorm.SelectQueryBuilder<any>);
    });
    it('calls createQueryBuilder and returns found orders', async () => {
      const dto = { status: OrderStatus.PROCESSING, search: 'miumau' };
      await expect(ordersRepository.fetch(dto, mockUser)).resolves.toEqual(bunchOfOrders);
      expect(ordersRepository.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('addOrderItems', () => {
    it("adds order's items by calling getManager and getConnection", async () => {
      jest
        .spyOn(ordersRepository, 'addOrderItems')
        .mockImplementation(() => new Promise(() => cartItems));
      expect(
        ordersRepository.addOrderItems('f29ca6ae-3aac-4794-b008-4d743901a226', mockUser)
      ).resolves.toEqual(cartItems);
    });
  });

  describe('createOrder', () => {
    it('creates new instance of Order and sets the attributes and saves it', async () => {
      const dto = {
        total_price: 15,
        address: 'Yeetstreet',
        country: 'Estonia',
        city: 'Parnu',
        postalcode: '01000',
      };

      jest
        .spyOn(ordersRepository, 'createOrder')
        .mockImplementation(() => new Promise(() => cartItems));
      expect(ordersRepository.createOrder(dto, mockUser)).resolves.toEqual({
        total_price: 15,
        address: 'Yeetstreet',
        country: 'Estonia',
        city: 'Parnu',
        postalcode: '01000',
        status: 'PROCESSING',
        userId: mockUser.id,
      });
    });
  });
});
