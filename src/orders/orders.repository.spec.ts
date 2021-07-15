import { Test } from '@nestjs/testing';
import { User } from '../users/user.entity';
import { Order } from './order.entity';
import { bunchOfOrders } from './orders.controller.spec';
import { OrdersRepository } from './orders.repository';
import * as typeorm from 'typeorm';

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
  let ordersRepository: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [OrdersRepository],
    }).compile();

    ordersRepository = module.get<OrdersRepository>(OrdersRepository);
  });

  const mockUser = new User();
  mockUser.id = 'e6a23d5f-3a23-498f-9f61-ffb9ad34cb68';
  mockUser.email = 'miumau@gmail.com';
  mockUser.password = 'yeetmageet123';

  describe('fetch', () => {
    it('calls createQueryBuilder and returns found orders', async () => {
      ordersRepository.createQueryBuilder = jest.fn(() => ({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(bunchOfOrders),
      }));
      const dto = { status: 'PROCESSING', search: 'miumau' };
      await expect(ordersRepository.fetch(dto, mockUser)).resolves.toEqual(bunchOfOrders);
      expect(ordersRepository.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('addOrderItems', () => {
    it("adds order's items by calling getManager and getConnection", async () => {
      const mock = jest.spyOn(typeorm, 'getManager').mockImplementation(() => {
        const original = jest.requireActual('typeorm');
        return {
          ...original,
          query: jest.fn().mockResolvedValue(cartItems),
        };
      });
      jest.spyOn(typeorm, 'getConnection').mockImplementation(() => {
        const original = jest.requireActual('typeorm');
        return {
          ...original,
          createQueryBuilder: jest.fn(() => ({
            insert: jest.fn().mockReturnThis(),
            into: jest.fn().mockReturnThis(),
            values: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValue(undefined),
          })),
        };
      });
      expect(
        ordersRepository.addOrderItems('f29ca6ae-3aac-4794-b008-4d743901a226', mockUser)
      ).resolves.toEqual(cartItems);
      expect(mock).toHaveBeenCalled();
    });
  });

  describe('createOrder', () => {
    it('creates new instance of Order and sets the attributes and saves it', async () => {
      jest.spyOn(Order, 'getRepository').mockImplementation(() => {
        const original = jest.requireActual('typeorm');
        return {
          ...original,
          save: jest.fn().mockReturnValue(bunchOfOrders[0]),
        };
      });
      const dto = {
        total_price: 15,
        address: 'Yeetstreet',
        country: 'Estonia',
        city: 'Parnu',
        postalcode: '01000',
      };
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
