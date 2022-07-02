import { Test } from '@nestjs/testing';
import { User } from '../users/user.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { CartService } from './cart.service';
import { CartRepositoryExtended } from './cart.repository';
import { Cart } from './cart.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CartItem } from './cart-item.entity';
import { Product } from '../product/product.entity';
import { AppDataSource } from 'src/config/typeorm.config';
import { Type } from '@nestjs/common';

const cartItem = {
  cartId: '2828bfce-29a0-4953-b539-f6d61a400321',
  quantity: 1,
  price: 9.5,
  productId: 28,
  id: '3c7df1c9-35dd-47f7-a511-cf88dc8f14a6',
  CreatedAt: '2021-07-14',
};

const product = {
  id: 8,
  categories: [
    { id: 'a47ba957-a742-45de-8610-13ba3e0ba4a0', cname: 'bestsellers' },
    { id: 'dcaa9f09-0dbe-4e81-af92-e15ee487beaa', cname: 'Milk Chocolate' },
  ],
  title: 'Dune',
  image: 'https://i.imgur.com/Hiw0N.jpg',
  price: 12,
  description: 'nice boek',
  status: 'IN_STOCK',
  createdAt: '2021-07-02',
  updatedAt: '2021-07-02',
} as unknown as Product;

const mockDataSource = () => ({
  createQueryRunner: jest.fn(),
});

const mockProductRepository = () => ({
  findOne: jest.fn(),
});

const mockCartItemRepository = () => ({
  createQueryBuilder: jest.fn().mockReturnValue({
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockReturnValue(cartItem),
  }),
});

const mockCartRepository = () => ({
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
  fetchCartItems: jest.fn(),
});

describe('CartService', () => {
  let cartService: CartService;
  let cartRepository: Repository<Cart> & CartRepositoryExtended;
  let cartItemRepository: Repository<CartItem>;
  let productRepository: Repository<Product>;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DataSource,
        CartService,
        {
          provide: getRepositoryToken(Cart),
          useFactory: mockCartRepository,
        },
        {
          provide: getRepositoryToken(CartItem),
          useFactory: mockCartItemRepository,
        },
        {
          provide: getRepositoryToken(Product),
          useFactory: mockProductRepository,
        },
      ],
    }).compile();

    cartService = module.get<CartService>(CartService);
    cartRepository = module.get<Repository<Cart> & CartRepositoryExtended>(
      getRepositoryToken(Cart)
    );
    cartItemRepository = module.get<Repository<CartItem>>(getRepositoryToken(CartItem));
    productRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
    dataSource = module.get<DataSource>(DataSource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockUser = new User();
  mockUser.id = 'e6a23d5f-3a23-498f-9f61-ffb9ad34cb68';
  mockUser.email = 'miumau@gmail.com';
  mockUser.password = 'yeetmageet123';

  const userCart = {
    id: '2828bfce-29a0-4953-b539-f6d61a400321',
    userId: 'e6a23d5f-3a23-498f-9f61-ffb9ad34cb68',
    CreatedAt: '2021-07-13',
  } as unknown as Cart;

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchItems', () => {
    it('calls cartService.fetchItems, which calls cartRepository.findOne and cartItemRepository.createQueryBuilder.select.where.getMany and returns cartItem[]', async () => {
      /* NOTE: Current implmentation of the mock function resides in the actual mockRepository,
       * remember to override it, incase you use createQueryBuilder in this module again ! */

      /* cartService.fetchItems calls cartRepository.findOne to get the user Cart,
       * then proceeds to calls cartItemRepository.createQueryBuilder.select.where.getMany,
       * to get User CartItem's. */
      jest.spyOn(cartRepository, 'findOne').mockResolvedValue(userCart);
      expect(await cartService.fetchItems(mockUser)).toEqual({
        id: expect.any(String),
        cartId: expect.any(String),
        price: expect.any(Number),
        productId: expect.any(Number),
        quantity: expect.any(Number),
        CreatedAt: expect.any(String),
      });
      // Tests each called function in the method scope
      expect(cartRepository.findOne).toHaveBeenCalled();
      expect(cartItemRepository.createQueryBuilder).toHaveBeenCalledWith('cartItem');
      expect(cartItemRepository.createQueryBuilder().select).toHaveBeenCalledWith('cartItem');
      expect(cartItemRepository.createQueryBuilder().where).toHaveBeenCalledWith(
        'cartItem.cartId = :cartId',
        {
          cartId: userCart.id,
        }
      );
      expect(cartItemRepository.createQueryBuilder().getMany).toHaveBeenCalled();
    });
  });

  describe('fetchCart', () => {
    it('calls cartRepository.findOne and returns the user cart, null incase user has no cart.', async () => {
      jest.spyOn(cartRepository, 'findOne').mockResolvedValue(userCart);
      expect(await cartService.fetchCart(mockUser)).toEqual({
        id: expect.any(String),
        userId: mockUser.id,
        CreatedAt: expect.any(String),
      });
      expect(cartRepository.findOne).toHaveBeenCalledWith({ where: { userId: mockUser.id } });
    });
  });

  describe('fetchProductPrice', () => {
    it('calls productRepository.findOne with the relevant productId', async () => {
      /* Calls productRepository.findOne with product id and
       * returns the product price from the product object. */
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(product);
      expect(await cartService.fetchProductPrice(8));
      expect(productRepository.findOne).toHaveBeenCalledWith({ where: { id: 8 } });
    });
  });

  describe('fetchCartItems', () => {
    it('calls cartRepository.findOne and queries database through dataSource for cart items with matching product id, returns Promise<CartItemInfo>', async () => {
      jest.spyOn(cartRepository, 'findOne').mockResolvedValue(userCart);
      jest.spyOn(dataSource, 'createQueryRunner');
      expect(await cartService.fetchCartItems(mockUser)).toEqual(null);
      expect(cartRepository.findOne).toHaveBeenCalledWith({ where: { userId: mockUser.id } });
    });
  });
});
