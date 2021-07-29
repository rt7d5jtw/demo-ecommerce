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
  clearCart: jest.fn(),
});

describe('CartController', () => {
  let cartController: CartController;
  let cartService: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [CartController],
      providers: [{ provide: CartService, useFactory: mockCartService }],
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
        userId: 'e6a23d5f-3a23-498f-9f61-ffb9ad34cb68',
        CreatedAt: '2021-07-03',
      });
      await expect(cartController.fetchCart(mockUser)).resolves.toEqual({
        id: expect.any(String),
        userId: 'e6a23d5f-3a23-498f-9f61-ffb9ad34cb68',
        CreatedAt: expect.any(String),
      });
      expect(cartService.fetchCart).toHaveBeenCalled();
    });
  });

  describe('fetchCartItems', () => {
    it("fetches user's cart items by calling cartService.fetchCartItems", async () => {
      cartService.fetchCartItems.mockResolvedValue([
        {
          id: '82208734-1ac7-4b7e-b436-363996d5661d',
          cartId: '7e83883a-8e90-41d0-8426-5da7096e730b',
          productId: 28,
          quantity: 1,
          price: 9.5,
          CreatedAt: '2021-07-12',
        },
      ]);
      await expect(cartController.fetchCartItems(mockUser)).resolves.toEqual([
        {
          id: expect.any(String),
          cartId: expect.any(String),
          productId: expect.any(Number),
          quantity: expect.any(Number),
          price: expect.any(Number),
          CreatedAt: expect.any(String),
        },
      ]);
      expect(cartService.fetchCartItems).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('fetchCartItems', () => {
    it('fetches cart items with title and image for the user by calling cartService.fetchCartItems', async () => {
      cartService.fetchCartItems.mockResolvedValue([
        {
          productId: 28,
          title: 'chocolate',
          image: 'https://i.imgur.com/Hiw0N.jpg',
          price: 9.5,
          quantity: 1,
        },
      ]);
      await expect(cartController.fetchCartItems(mockUser)).resolves.toEqual([
        {
          productId: expect.any(Number),
          title: expect.any(String),
          image: expect.any(String),
          price: expect.any(Number),
          quantity: expect.any(Number),
        },
      ]);
      expect(cartService.fetchCartItems).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('fetchProductPrice', () => {
    it('fetches price of a cart item based on productId', async () => {
      cartService.fetchProductPrice.mockResolvedValue(9.5);
      await expect(cartController.fetchProductPrice(28)).resolves.toEqual(9.5);
      expect(cartService.fetchProductPrice).toHaveBeenCalledWith(28);
    });
  });

  describe('createCart', () => {
    it("creates cart for the user if it doesn't already exist", async () => {
      cartService.createCart.mockResolvedValue({
        userId: 'e6a23d5f-3a23-498f-9f61-ffb9ad34cb68',
        id: '59bfe367-672f-48e7-87ab-4512be621d4c',
        CreatedAt: '2021-07-13',
      });
      await expect(cartController.createCart(mockUser)).resolves.toEqual({
        userId: 'e6a23d5f-3a23-498f-9f61-ffb9ad34cb68',
        id: expect.any(String),
        CreatedAt: expect.any(String),
      });
      expect(cartService.createCart).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('addToCart', () => {
    it('adds a product to the cart of a user by calling cartService.addToCart', async () => {
      cartService.addToCart.mockResolvedValue({
        id: 'a6edad94-222f-4d18-b020-967a3aa027e4',
        cartId: '59bfe367-672f-48e7-87ab-4512be621d4c',
        productId: 28,
        quantity: 1,
        price: 9.5,
        CreatedAt: '2021-07-13',
      });
      expect(cartController.addToCart(28, mockUser, { quantity: 1 })).resolves.toEqual({
        cartId: expect.any(String),
        quantity: 1,
        price: expect.any(Number),
        productId: 28,
        id: expect.any(String),
        CreatedAt: expect.any(String),
      });
      expect(cartService.addToCart).toHaveBeenCalledWith(28, mockUser, { quantity: 1 });
    });
  });

  describe('removeCartItem', () => {
    it('removes cart item by productId by calling cartService.removeCartItem', async () => {
      cartService.removeCartItem.mockResolvedValue(undefined);
      expect(cartController.removeCartItem(28, mockUser)).resolves.not.toThrow();
      expect(cartService.removeCartItem).toHaveBeenCalledWith(28, mockUser);
    });
  });

  describe('clearCart', () => {
    it('clears users cart of all items', async () => {
      cartService.clearCart.mockResolvedValue(undefined);
      await expect(cartController.clearCart(mockUser)).resolves.not.toThrow();
      expect(cartService.clearCart).toHaveBeenCalledWith(mockUser);
    });
  });
});
