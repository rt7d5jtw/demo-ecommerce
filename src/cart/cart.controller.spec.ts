import { Test } from '@nestjs/testing';
import { User } from '../users/user.entity';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

const mockCartService = () => ({
  fetchCart: jest.fn(),
  fetchCartItems: jest.fn(),
  fetchProductPrice: jest.fn(),
  createCart: jest.fn(),
  addToCart: jest.fn(),
  removeCartItem: jest.fn(),
  clearCart: jest.fn()
});

describe('CartController', () => {
  let cartController: CartController;
  let cartService: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [CartController],
      providers: [{ provide: CartService, useFactory: mockCartService }]
    }).compile();

    cartController = module.get<CartController>(CartController);
    cartService = module.get<CartService>(CartService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockUser = new User();
  mockUser.id = 'e6a23d5f-3a23-498f-9f61-ffb9ad34cb68';
  mockUser.email = 'miumau@gmail.com';
  mockUser.password = 'yeetmageet123';

  describe('fetchCart', () => {
    it("returns user's cart by calling cartService.fetchCart", async () => {
      cartService.fetchCart.mockResolvedValue({
        id: '7e83883a-8e90-41d0-8426-5da7096e730b',
        user_id: 'e6a23d5f-3a23-498f-9f61-ffb9ad34cb68',
        created_at: '2021-07-03'
      });
      expect(await cartController.fetchCart(mockUser)).toEqual({
        id: expect.any(String),
        user_id: 'e6a23d5f-3a23-498f-9f61-ffb9ad34cb68',
        created_at: expect.any(String)
      });
      expect(await cartService.fetchCart).toHaveBeenCalled();
    });
  });

  describe('fetchCartItems', () => {
    it("fetches user's cart items by calling cartService.fetchCartItems", async () => {
      cartService.fetchCartItems.mockResolvedValue([
        {
          id: '82208734-1ac7-4b7e-b436-363996d5661d',
          cart_id: '7e83883a-8e90-41d0-8426-5da7096e730b',
          product_id: 28,
          quantity: 1,
          price: 9.5,
          created_at: '2021-07-12'
        }
      ]);
      expect(await cartController.fetchCartItems(mockUser)).toEqual([
        {
          id: expect.any(String),
          cart_id: expect.any(String),
          product_id: expect.any(Number),
          quantity: expect.any(Number),
          price: expect.any(Number),
          created_at: expect.any(String)
        }
      ]);
      expect(await cartService.fetchCartItems).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('fetchCartItems', () => {
    it('fetches cart items with title and image for the user by calling cartService.fetchCartItems', async () => {
      cartService.fetchCartItems.mockResolvedValue([
        {
          product_id: 28,
          title: 'chocolate',
          image: 'https://i.imgur.com/Hiw0N.jpg',
          price: 9.5,
          quantity: 1
        }
      ]);
      expect(await cartController.fetchCartItems(mockUser)).toEqual([
        {
          product_id: expect.any(Number),
          title: expect.any(String),
          image: expect.any(String),
          price: expect.any(Number),
          quantity: expect.any(Number)
        }
      ]);
      expect(await cartService.fetchCartItems).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('fetchProductPrice', () => {
    it('fetches price of a cart item based on product_id', async () => {
      cartService.fetchProductPrice.mockResolvedValue(9.5);
      expect(await cartController.fetchProductPrice(28)).toEqual(9.5);
      expect(await cartService.fetchProductPrice).toHaveBeenCalledWith(28);
    });
  });

  describe('createCart', () => {
    it("creates cart for the user if it doesn't already exist", async () => {
      cartService.createCart.mockResolvedValue({
        user_id: 'e6a23d5f-3a23-498f-9f61-ffb9ad34cb68',
        id: '59bfe367-672f-48e7-87ab-4512be621d4c',
        created_at: '2021-07-13'
      });
      expect(await cartController.createCart(mockUser)).toEqual({
        user_id: 'e6a23d5f-3a23-498f-9f61-ffb9ad34cb68',
        id: expect.any(String),
        created_at: expect.any(String)
      });
      expect(await cartService.createCart).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('addToCart', () => {
    it('adds a product to the cart of a user by calling cartService.addToCart', async () => {
      cartService.addToCart.mockResolvedValue({
        id: 'a6edad94-222f-4d18-b020-967a3aa027e4',
        cart_id: '59bfe367-672f-48e7-87ab-4512be621d4c',
        product_id: 28,
        quantity: 1,
        price: 9.5,
        created_at: '2021-07-13'
      });
      expect(
        await cartController.addToCart(28, mockUser, { quantity: 1 })
      ).toEqual({
        cart_id: expect.any(String),
        quantity: 1,
        price: expect.any(Number),
        product_id: 28,
        id: expect.any(String),
        created_at: expect.any(String)
      });
      expect(await cartService.addToCart).toHaveBeenCalledWith(28, mockUser, {
        quantity: 1
      });
    });
  });

  describe('removeCartItem', () => {
    it('removes cart item by product_id by calling cartService.removeCartItem', async () => {
      cartService.removeCartItem.mockResolvedValue(undefined);
      expect(await cartController.removeCartItem(28, mockUser)).toBeUndefined();
      expect(await cartService.removeCartItem).toHaveBeenCalledWith(
        28,
        mockUser
      );
    });
  });

  describe('clearCart', () => {
    it('clears users cart of all items', async () => {
      cartService.clearCart.mockResolvedValue(undefined);
      expect(await cartController.clearCart(mockUser)).toBeUndefined();
      expect(await cartService.clearCart).toHaveBeenCalledWith(mockUser);
    });
  });
});
