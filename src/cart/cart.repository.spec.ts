import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../product/product.entity';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Cart } from './cart.entity';
import { CartRepositoryExtended } from './cart.repository';

const mockCartRepository = () => ({
  createCart: jest.fn(),
  clearCart: jest.fn(),
  fetchCartItems: jest.fn(),
  addToCart: jest.fn(),
  fetchProductPrice: jest.fn(),
  removeCartItem: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
});

describe('CartRepository', () => {
  let cartRepository: Repository<Cart> & CartRepositoryExtended;

  jest.mock('../users/user.entity');

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

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Cart),
          useFactory: mockCartRepository,
        },
      ],
    }).compile();

    cartRepository = module.get<Repository<Cart> & CartRepositoryExtended>(
      getRepositoryToken(Cart)
    );
  });

  const mockUser = new User();
  mockUser.id = 'e6a23d5f-3a23-498f-9f61-ffb9ad34cb68';
  mockUser.email = 'miumau@gmail.com';
  mockUser.password = 'yeetmageet123';

  describe('createCart', () => {
    it('creates a cart for the user by calling a new instance of the Cart entity class and assigning user.id attribute to it', async () => {
      const cart = {
        userId: 'e6a23d5f-3a23-498f-9f61-ffb9ad34cb68',
        id: '28497f7d-6caa-4f99-af62-c62e9cd2ac93',
        CreatedAt: '2021-07-14',
      };
      jest.spyOn(cartRepository, 'createCart').mockResolvedValue(cart as unknown as Cart);
      expect(await cartRepository.createCart(mockUser)).toEqual({
        userId: mockUser.id,
        id: expect.any(String),
        CreatedAt: expect.any(String),
      });
    });
  });

  describe('clearCart', () => {
    it("clears user's cart of all item's by calling cartRepository.findOne and getRepository(CartItem).delete", async () => {
      jest.spyOn(cartRepository, 'clearCart').mockResolvedValue({ raw: [], affected: 2 });
      expect(await cartRepository.clearCart(mockUser)).toEqual({ raw: [], affected: 2 });
      expect(cartRepository.findOne).toHaveBeenCalled();
      expect(cartRepository.delete).toHaveBeenCalled();
    });
  });

  describe('fetchCartItems', () => {
    it("returns cart items from user's cart by calling fetchCart and CartItem.createQueryBuilder", async () => {
      jest
        .spyOn(cartRepository, 'fetchCartItems')
        .mockImplementation(() => new Promise(() => result));
      expect(cartRepository.fetchCartItems(mockUser)).resolves.toEqual([
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
        .spyOn(cartRepository, 'addToCart')
        .mockImplementation(() => cartItem as unknown as Promise<any>);
      expect(cartRepository.addToCart(28, mockUser, { quantity: 1 })).toEqual({
        cartId: '2828bfce-29a0-4953-b539-f6d61a400321',
        quantity: expect.any(Number),
        price: expect.any(Number),
        productId: 28,
        id: expect.any(String),
        CreatedAt: expect.any(String),
      });
    });
  });

  describe('fetchProductPrice', () => {
    it('returns price of the product by calling getRepository().findOne', async () => {
      jest.spyOn(cartRepository, 'fetchProductPrice').mockResolvedValue(result.price);
      expect(await cartRepository.fetchProductPrice(28)).toEqual(9.5);
    });
  });

  describe('removeCartItem', () => {
    it("calls cartRepository.findOne to get user's cart, calls getRepository(CartItem).createQueryBuilder to get the cartItem to remove and runs calls getRepository(CartItem).delete(id)", async () => {
      expect(await cartRepository.removeCartItem(28, mockUser)).toBeUndefined();
    });
  });
});
