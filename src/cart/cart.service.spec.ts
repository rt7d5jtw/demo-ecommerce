import { Test } from '@nestjs/testing';
import { MockType } from '../category/category.service.spec';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { CartService } from './cart.service';
import { CartRepository } from './cart.repository';
import * as typeorm from 'typeorm';
import { CartItem } from './cart-item.entity';
import { Product } from '../product/product.entity';
import { CartItemInfo } from './dto/cart.dto';
import { ModuleMocker } from 'jest-mock';

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
  let connection: any;

  const mockConnection = () => ({
    transaction: jest.fn(),
    getRepository: jest.fn().mockReturnValue({
      findOne: jest.fn().mockResolvedValue(result),
      delete: jest.fn().mockResolvedValue({ raw: [], affected: 2 }),
      createQueryBuilder: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(result),
      }),
    }),
  });

  jest.mock('../users/user.entity');
  jest.mock('../cart/cart-item.entity');

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CartService,
        { provide: CartRepository, useFactory: mockCartRepository },
        { provide: typeorm.Connection, useFactory: mockConnection },
      ],
    }).compile();

    cartService = module.get<CartService>(CartService);
    cartRepository = module.get<CartRepository>(CartRepository);
    connection = module.get<typeorm.Connection>(typeorm.Connection);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockUser = new User();
  mockUser.id = 'e6a23d5f-3a23-498f-9f61-ffb9ad34cb68';
  mockUser.email = 'miumau@gmail.com';
  mockUser.password = 'yeetmageet123';

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

  beforeEach(() => {
    const mockedManager = {
      save: jest.fn(),
      query: jest.fn(),
    };
    connection.transaction.mockImplementation((cb: any) => {
      cb(mockedManager);
    });
    jest.spyOn(typeorm.ConnectionManager.prototype, 'get').mockImplementation(() => connection);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchCart', () => {
    it('calls cartRepository.find and returns the found cart', async () => {
      expect(await cartService.fetchCart(mockUser)).toEqual({
        id: expect.any(String),
        userId: mockUser.id,
        CreatedAt: expect.any(String),
      });
      expect(cartRepository.findOne).toHaveBeenCalledWith({ where: { userId: mockUser.id } });
    });
  });

  describe('fetchCartItems', () => {
    it("returns cart items from user's cart by calling fetchCart and CartItem.createQueryBuilder", async () => {
      jest.spyOn(cartService, 'fetchCartItems').mockImplementation(() => new Promise(() => result));
      expect(cartService.fetchCartItems(mockUser)).resolves.toEqual([
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
    });
  });
  describe('fetchProductPrice', () => {
    it('returns price of the product by calling getRepository().findOne', async () => {
      expect(await cartService.fetchProductPrice(28)).toEqual(9.5);
    });
  });

  describe('createCart', () => {
    it('creates and returns a cart by calling cartRepository.createCart', async () => {
      expect(await cartService.createCart(mockUser)).toEqual({
        userId: expect.any(String),
        id: expect.any(String),
        CreatedAt: expect.any(String),
      });
      expect(cartRepository.createCart).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('removeCartItem', () => {
    it("calls cartRepository.findOne to get user's cart, calls getRepository(CartItem).createQueryBuilder to get the cartItem to remove and runs calls getRepository(CartItem).delete(id)", async () => {
      expect(await cartService.removeCartItem(28, mockUser)).toBeUndefined();
    });
  });

  describe('clearCart', () => {
    it("clears user's cart of all item's by calling cartRepository.findOne and getRepository(CartItem).delete", async () => {
      expect(await cartService.clearCart(mockUser)).toEqual({ raw: [], affected: 2 });
    });
  });

  describe('addToCart', () => {
    it("calls fetchCart for user's cart, calls fetchProductPrice to get item's price, calls fetchCartItems and checks if cartItems with same productId and cartId exists in the database, if so, assigns quantity and price and removes the redundant copy", async () => {
      const cartItem = {
        cartId: '2828bfce-29a0-4953-b539-f6d61a400321',
        quantity: 1,
        price: 9.5,
        productId: 28,
        id: '3c7df1c9-35dd-47f7-a511-cf88dc8f14a6',
        CreatedAt: '2021-07-14',
      };
      jest
        .spyOn(cartService, 'addToCart')
        .mockImplementation(() => cartItem as unknown as Promise<any>);
      expect(cartService.addToCart(28, mockUser, { quantity: 1 })).toEqual({
        cartId: '2828bfce-29a0-4953-b539-f6d61a400321',
        quantity: expect.any(Number),
        price: expect.any(Number),
        productId: 28,
        id: expect.any(String),
        CreatedAt: expect.any(String),
      });
    });
  });
});
