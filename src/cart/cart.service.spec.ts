import { Test } from '@nestjs/testing';
import { MockType } from '../category/category.service.spec';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { CartService } from './cart.service';
import { CartRepository } from './cart.repository';
import * as typeorm from 'typeorm';
import { OrderItem } from '../orders/order-item.entity';
import { CartItem } from './cart-item.entity';

const mockCartRepository: () => MockType<Repository<any>> = jest.fn(() => ({
  findOne: jest.fn().mockResolvedValue({
    id: '59bfe367-672f-48e7-87ab-4512be621d4c',
    userId: 'e6a23d5f-3a23-498f-9f61-ffb9ad34cb68',
    CreatedAt: '2021-07-13',
  }),
  createQueryBuilder: jest.fn(),
}));

describe('CartService', () => {
  let cartService: CartService;
  let cartRepository: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [CartService, { provide: CartRepository, useFactory: mockCartRepository }],
    }).compile();

    cartService = module.get<CartService>(CartService);
    cartRepository = module.get<CartRepository>(CartRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockUser = new User();
  mockUser.id = 'e6a23d5f-3a23-498f-9f61-ffb9ad34cb68';
  mockUser.email = 'miumau@gmail.com';
  mockUser.password = 'yeetmageet123';

  describe('fetchCart', () => {
    it('calls cartRepository.find and returns the found cart', async () => {
      await expect(cartService.fetchCart(mockUser)).resolves.toEqual({
        id: expect.any(String),
        userId: mockUser.id,
        CreatedAt: expect.any(String),
      });
      expect(cartRepository.findOne).toHaveBeenCalledWith({ where: { userId: mockUser.id } });
    });
  });

  describe('fetchCartItems', () => {
    it("returns cart items from user's cart by calling fetchCart and CartItem.createQueryBuilder", async () => {
      const result = [
        {
          id: '32915e86-b6c3-469a-bf77-ffdab8d7b0ac',
          cartId: '59bfe367-672f-48e7-87ab-4512be621d4c',
          productId: 28,
          quantity: 1,
          price: 9.5,
          CreatedAt: '2021-07-13',
        },
      ];
      const cartItemRepo = jest.spyOn(typeorm, 'getRepository').mockImplementation(() => {
        const original = jest.requireActual('typeorm');
        return {
          ...original,
          createQueryBuilder: jest.fn().mockImplementation(() => ({
            select: jest.fn().mockReturnThis() as unknown,
            where: jest.fn().mockReturnThis() as unknown,
            subQuery: jest.fn().mockReturnThis() as unknown,
            from: jest.fn().mockReturnThis() as unknown,
            getQuery: jest.fn().mockReturnThis() as unknown,
            setParameter: jest.fn().mockReturnThis() as unknown,
            getMany: jest.fn().mockResolvedValue(result) as unknown,
          })),
        };
      });
      await expect(cartService.fetchCartItems(mockUser)).resolves.toEqual([
        {
          id: expect.any(String),
          cartId: expect.any(String),
          productId: expect.any(Number),
          quantity: expect.any(Number),
          price: expect.any(Number),
          CreatedAt: expect.any(String),
        },
      ]);
      expect(cartRepository.findOne).toHaveBeenCalledWith({ where: { userId: mockUser.id } });
      expect(cartItemRepo).toHaveBeenCalledWith(CartItem);
    });
  });
});
