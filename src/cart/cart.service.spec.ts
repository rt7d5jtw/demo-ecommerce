import { Test } from '@nestjs/testing';
import { MockType } from '../category/category.service.spec';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { CartService } from './cart.service';
import { CartRepository } from './cart.repository';
import * as typeorm from 'typeorm';
import { CartItem } from './cart-item.entity';
import { Product } from '../product/product.entity';

const mockCartRepository: () => MockType<Repository<any>> = jest.fn(() => ({
  findOne: jest.fn().mockResolvedValue({
    id: '2828bfce-29a0-4953-b539-f6d61a400321',
    userId: 'e6a23d5f-3a23-498f-9f61-ffb9ad34cb68',
    CreatedAt: '2021-07-13',
  }),
  createQueryBuilder: jest.fn(),
  createCart: jest.fn().mockResolvedValue({
    userId: 'e6a23d5f-3a23-498f-9f61-ffb9ad34cb68',
    id: '2828bfce-29a0-4953-b539-f6d61a400321',
    CreatedAt: '2021-07-14',
  }),
  save: jest.fn().mockResolvedValue('yeet'),
}));

describe('CartService', () => {
  let cartService: CartService;
  let cartRepository: any;

  jest.mock('../users/user.entity');
  jest.mock('../cart/cart-item.entity');

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
          id: '36a084b6-5d6c-43fc-b2b4-83312abfe7ab',
          cartId: '2828bfce-29a0-4953-b539-f6d61a400321',
          productId: 25,
          quantity: 1,
          price: 7,
          CreatedAt: '2021-07-14',
        },
        {
          id: '5d24e595-b568-4c44-8e7e-0a99ae1da60c',
          cartId: '2828bfce-29a0-4953-b539-f6d61a400321',
          productId: 28,
          quantity: 1,
          price: 9.5,
          CreatedAt: '2021-07-14',
        },
      ];
      jest.spyOn(typeorm, 'getManager').mockImplementation(() => {
        const original = jest.requireActual('typeorm');
        return {
          ...original,
          query: jest.fn().mockReturnValue(result),
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
    });
  });

  describe('fetchCartItems', () => {
    it('returns cart items with additional info by calling cartRepository.find and getManager.query', async () => {
      const cartItems = [
        {
          productId: 28,
          title: 'chocolate',
          image: 'https://i.imgur.com/Hiw0N.jpg',
          price: 9.5,
          quantity: 1,
        },
        {
          productId: 25,
          title: 'Hot Dogs',
          image: 'https://i.imgur.com/5yJFUfy.png',
          price: 7,
          quantity: 1,
        },
      ];
      const getManagerMock = jest.spyOn(typeorm, 'getManager').mockImplementation(() => {
        const original = jest.requireActual('typeorm');
        return {
          ...original,
          query: jest.fn().mockResolvedValue(cartItems) as unknown,
        };
      });
      await expect(cartService.fetchCartItems(mockUser)).resolves.toEqual([
        {
          productId: expect.any(Number),
          title: expect.any(String),
          image: expect.any(String),
          price: expect.any(Number),
          quantity: expect.any(Number),
        },
        {
          productId: expect.any(Number),
          title: expect.any(String),
          image: expect.any(String),
          price: expect.any(Number),
          quantity: expect.any(Number),
        },
      ]);
      expect(cartRepository.findOne).toHaveBeenCalledWith({ where: { userId: mockUser.id } });
      expect(getManagerMock).toHaveBeenCalled();
    });
  });

  describe('fetchProductPrice', () => {
    it('returns price of the product by calling getRepository().findOne', async () => {
      const result = {
        id: 28,
        categoryId: 'dcaa9f09-0dbe-4e81-af92-e15ee487beaa',
        title: 'chocolate',
        image: 'https://i.imgur.com/Hiw0N.jpg',
        price: 9.5,
        description: 'i like chocolate',
        status: 'IN_STOCK',
        createdAt: '2021-07-02',
        updatedAt: '2021-07-02',
      };
      const getRepositoryMock = jest.spyOn(typeorm, 'getRepository').mockImplementation(() => {
        const original = jest.requireActual('typeorm');
        return {
          ...original,
          findOne: jest.fn().mockResolvedValue(result),
        };
      });
      expect(cartService.fetchProductPrice(28)).resolves.toEqual(9.5);
      expect(getRepositoryMock).toHaveBeenCalledWith(Product);
    });
  });

  describe('createCart', () => {
    it('creates and returns a cart by calling cartRepository.createCart', async () => {
      await expect(cartService.createCart(mockUser)).resolves.toEqual({
        userId: expect.any(String),
        id: expect.any(String),
        CreatedAt: expect.any(String),
      });
      expect(cartRepository.createCart).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('removeCartItem', () => {
    it("calls cartRepository.findOne to get user's cart, calls getRepository(CartItem).createQueryBuilder to get the cartItem to remove and runs calls getRepository(CartItem).delete(id)", async () => {
      const result = {
        id: '4a5286aa-4280-4f1b-ab54-b2a16e7376c9',
        cartId: '2828bfce-29a0-4953-b539-f6d61a400321',
        productId: 28,
        quantity: 1,
        price: 9.5,
        CreatedAt: '2021-07-14',
      };
      jest.spyOn(typeorm, 'getRepository').mockImplementation(() => {
        const original = jest.requireActual('typeorm');
        return {
          ...original,
          delete: jest.fn().mockReturnValue({
            raw: [],
            affected: 1,
          }),
          createQueryBuilder: jest.fn().mockImplementation(() => ({
            where: jest.fn().mockReturnThis() as unknown,
            andWhere: jest.fn().mockReturnThis() as unknown,
            getOne: jest.fn().mockResolvedValue(result),
          })),
        };
      });
      expect(cartService.removeCartItem(28, mockUser)).resolves.not.toThrow();
      expect(cartRepository.findOne).toHaveBeenCalledWith({ where: { userId: mockUser.id } });
    });
  });

  describe('clearCart', () => {
    it("clears user's cart of all item's by calling cartRepository.findOne and getRepository(CartItem).delete", async () => {
      const mock = jest.spyOn(typeorm, 'getRepository').mockImplementation(() => {
        const original = jest.requireActual('typeorm');
        return {
          ...original,
          delete: jest.fn().mockResolvedValue({
            raw: [],
            affected: 2,
          }),
        };
      });
      expect(cartService.clearCart(mockUser)).resolves.toEqual({ raw: [], affected: 2 });
      expect(cartRepository.findOne).toHaveBeenCalledWith({ where: { userId: mockUser.id } });
      expect(mock).toHaveBeenCalledWith(CartItem);
    });
  });

  describe('addToCart', () => {
    it("calls fetchCart for user's cart, calls fetchProductPrice to get item's price, calls fetchCartItems and checks if cartItems with same productId and cartId exists in the database, if so, assigns quantity and price and removes the redundant copy", async () => {
      const result = {
        id: 28,
        categoryId: 'dcaa9f09-0dbe-4e81-af92-e15ee487beaa',
        title: 'chocolate',
        image: 'https://i.imgur.com/Hiw0N.jpg',
        price: 9.5,
        description: 'i like chocolate',
        status: 'IN_STOCK',
        createdAt: '2021-07-02',
        updatedAt: '2021-07-02',
      };
      const cartItem = {
        cartId: '2828bfce-29a0-4953-b539-f6d61a400321',
        quantity: 1,
        price: 9.5,
        productId: 28,
        id: '3c7df1c9-35dd-47f7-a511-cf88dc8f14a6',
        CreatedAt: '2021-07-14',
      };
      jest.spyOn(CartItem, 'getRepository').mockImplementation(() => {
        const original = jest.requireActual('typeorm');
        return {
          ...original,
          save: jest.fn().mockResolvedValue(cartItem),
        };
      });
      jest.spyOn(typeorm, 'getRepository').mockImplementation(() => {
        const original = jest.requireActual('typeorm');
        return {
          ...original,
          findOne: jest.fn().mockResolvedValue(result),
          createQueryBuilder: jest.fn().mockImplementation(() => ({
            select: jest.fn().mockReturnThis() as unknown,
            where: jest.fn().mockReturnThis() as unknown,
            andWhere: jest.fn().mockReturnThis() as unknown,
            getMany: jest.fn().mockResolvedValue([]),
            getOne: jest.fn().mockResolvedValue(undefined),
          })),
        };
      });
      expect(cartService.addToCart(28, mockUser, { quantity: 1 })).resolves.toEqual({
        cartId: '2828bfce-29a0-4953-b539-f6d61a400321',
        quantity: expect.any(Number),
        price: expect.any(Number),
        productId: 28,
        id: expect.any(String),
        CreatedAt: expect.any(String),
      });
      expect(cartRepository.findOne).toHaveBeenCalledWith({ where: { userId: mockUser.id } });
    });
  });
});
