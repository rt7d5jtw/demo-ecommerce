import { Test } from '@nestjs/testing';
import { User } from '../users/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CartService } from './cart.service';
import { Cart } from './cart.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CartItem } from './cart-item.entity';
import { Product } from '../product/product.entity';
import * as Testdata from '../../test/testdata.json';

jest.mock('../cart/cart.entity'); // Mocking Cart for createClass test

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:
  jest.clearAllMocks();
});

const cartItem = {
  cart_id: '2828bfce-29a0-4953-b539-f6d61a400321',
  quantity: 1,
  price: 9.5,
  product_id: 28,
  id: '3c7df1c9-35dd-47f7-a511-cf88dc8f14a6',
  created_at: '2021-07-14'
};

const product = {
  id: 8,
  categories: [
    { id: 'a47ba957-a742-45de-8610-13ba3e0ba4a0', cname: 'bestsellers' },
    { id: 'dcaa9f09-0dbe-4e81-af92-e15ee487beaa', cname: 'Milk Chocolate' }
  ],
  title: 'Dune',
  image: 'https://i.imgur.com/Hiw0N.jpg',
  price: 12,
  description: 'nice boek',
  status: 'IN_STOCK',
  created_at: '2021-07-02',
  updated_at: '2021-07-02'
} as unknown as Product;

const mockProductRepository = () => ({
  findOne: jest.fn()
});

const mockCartItemRepository = () => ({
  insert: jest.fn(),
  delete: jest.fn(),
  query: jest.fn().mockResolvedValue(Testdata.arrayOfCartItems),
  createQueryBuilder: jest.fn().mockReturnValue({
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockReturnValue(cartItem),
    getOne: jest.fn().mockImplementation(() => {
      const data = Testdata.arrayOfCartItems[0];
      // Setting to align with mockUser's cart_id
      data.cart_id = '2828bfce-29a0-4953-b539-f6d61a400321';
      return data;
    }),
    delete: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    execute: jest.fn().mockImplementation(() => {
      const del = new DeleteResult();
      del.raw = [];
      del.affected = 1;
      return del;
    })
  })
});

const mockCartRepository = () => ({
  findOne: jest.fn().mockResolvedValue({
    id: '2828bfce-29a0-4953-b539-f6d61a400321',
    user_id: 'e6a23d5f-3a23-498f-9f61-ffb9ad34cb68',
    created_at: '2021-07-13'
  }),
  createQueryBuilder: jest.fn(),
  createCart: jest.fn().mockResolvedValue({
    user_id: 'e6a23d5f-3a23-498f-9f61-ffb9ad34cb68',
    id: '2828bfce-29a0-4953-b539-f6d61a400321',
    created_at: '2021-07-14'
  }),
  save: jest.fn().mockResolvedValue('yeet'),
  fetchCartItems: jest.fn()
});

describe('CartService', () => {
  let cartService: CartService;
  let cartRepository: Repository<Cart>;
  let cartItemRepository: Repository<CartItem>;
  let productRepository: Repository<Product>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: getRepositoryToken(Cart),
          useFactory: mockCartRepository
        },
        {
          provide: getRepositoryToken(CartItem),
          useFactory: mockCartItemRepository
        },
        {
          provide: getRepositoryToken(Product),
          useFactory: mockProductRepository
        }
      ]
    }).compile();

    cartService = module.get<CartService>(CartService);
    cartRepository = module.get<Repository<Cart>>(getRepositoryToken(Cart));
    cartItemRepository = module.get<Repository<CartItem>>(
      getRepositoryToken(CartItem)
    );
    productRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product)
    );
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
    user_id: 'e6a23d5f-3a23-498f-9f61-ffb9ad34cb68',
    created_at: '2021-07-13'
  } as unknown as Cart;

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchCart', () => {
    it('calls cartRepository.findOne and returns the user cart, null incase user has no cart.', async () => {
      jest.spyOn(cartRepository, 'findOne').mockResolvedValue(userCart);
      expect(await cartService.fetchCart(mockUser)).toEqual({
        id: expect.any(String),
        user_id: mockUser.id,
        created_at: expect.any(String)
      });
      expect(cartRepository.findOne).toHaveBeenCalledWith({
        where: { user_id: mockUser.id }
      });
    });
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
        cart_id: expect.any(String),
        price: expect.any(Number),
        product_id: expect.any(Number),
        quantity: expect.any(Number),
        created_at: expect.any(String)
      });
      // Tests each called function in the method scope
      expect(cartRepository.findOne).toHaveBeenCalled();
      expect(cartItemRepository.createQueryBuilder).toHaveBeenCalledWith(
        'cart_item'
      );
      expect(
        cartItemRepository.createQueryBuilder().select
      ).toHaveBeenCalledWith('cart_item');
      expect(
        cartItemRepository.createQueryBuilder().where
      ).toHaveBeenCalledWith('cart_item.cart_id = :cart_id', {
        cart_id: userCart.id
      });
      expect(
        cartItemRepository.createQueryBuilder().getMany
      ).toHaveBeenCalled();
    });
  });

  describe('fetchProductPrice', () => {
    it('calls productRepository.findOne with the relevant product_id', async () => {
      /* Calls productRepository.findOne with product id and
       * returns the product price from the product object. */
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(product);
      expect(await cartService.fetchProductPrice(8)).toEqual(12);
      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { id: 8 }
      });
    });
  });

  describe('fetchCartItems', () => {
    it('calls cartRepository.findOne and queries database through dataSource for cart items with matching product id, returns Promise<CartItemInfo>', async () => {
      jest.spyOn(cartRepository, 'findOne').mockResolvedValue(userCart);

      expect(await cartService.fetchCartItems(mockUser)).toEqual(
        Testdata.arrayOfCartItems
      );

      expect(cartRepository.findOne).toHaveBeenCalledWith({
        where: { user_id: mockUser.id }
      });
      expect(cartItemRepository.query).toHaveBeenCalled();
    });
  });

  describe('removeCartItem', () => {
    it(`Removes a CartItem from User.
        1. Calls cartRepository.findOne with the input User.id,
        2. Calls cartItemRepository.createQueryBuilder to get the User CartItem
        3. If User CartItem was found, it is deleted.`, async () => {
      jest.spyOn(cartRepository, 'findOne').mockResolvedValue(userCart);

      const del = new DeleteResult();
      del.raw = [];
      del.affected = 1;

      jest.spyOn(cartItemRepository, 'delete').mockResolvedValue(del);

      expect(await cartService.removeCartItem(8, mockUser)).toEqual({
        raw: [],
        affected: 1
      });
      expect(cartRepository.findOne).toHaveBeenCalledWith({
        where: { user_id: mockUser['id'] }
      });
      expect(cartItemRepository.createQueryBuilder).toHaveBeenCalled();
      expect(cartItemRepository.createQueryBuilder().where).toHaveBeenCalled();
      expect(
        cartItemRepository.createQueryBuilder().andWhere
      ).toHaveBeenCalled();
      expect(cartItemRepository.createQueryBuilder().getOne).toHaveBeenCalled();
      expect(cartItemRepository.delete).toHaveBeenCalled();
    });
  });

  describe('createCart', () => {
    it('creates a Cart for the User by calling the constructor of the Cart class and setting the user_id to the id of the user, calls and returns cartRepository.save', async () => {
      jest.spyOn(cartRepository, 'findOne').mockResolvedValue(null); // User has to have no cart.
      jest.spyOn(cartRepository, 'save').mockResolvedValue(userCart);
      expect(await cartService.createCart(mockUser)).toEqual(userCart);
      expect(Cart).toHaveBeenCalledTimes(1); // Call to the constructor
      expect(cartRepository.save).toHaveBeenCalled();
    });
  });

  describe('batchAddProducts', () => {
    it(`Adds array of cart items into User's Cart and returns the InsertResult.`, async () => {
      jest
        .spyOn(cartItemRepository, 'insert')
        .mockResolvedValue(Testdata.cartItemRepository_insertation_result);
      jest.spyOn(cartRepository, 'findOne').mockResolvedValue(userCart);
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(product);
      jest.spyOn(cartService, 'fetchItems').mockResolvedValue([]); // Give back empty cart.

      const result = await cartService.batchAddProducts(
        [46, 46, 40, 53, 222, 222, 222],
        mockUser
      );
      expect(result).toBeDefined();
      expect(result['identifiers'][0]).toMatchObject({
        id: expect.any(String)
      });
      expect(result['generatedMaps'][0]).toMatchObject({
        id: expect.any(String),
        created_at: expect.any(String)
      });
      expect(result['raw'][0]).toMatchObject({
        id: expect.any(String),
        created_at: expect.any(String)
      });

      expect(cartRepository.findOne).toHaveBeenCalledWith({
        where: { user_id: mockUser.id }
      });
      expect(cartRepository.findOne).toHaveBeenCalledWith({
        where: { user_id: mockUser.id }
      });
      expect(productRepository.findOne).toHaveBeenCalled();
      expect(cartItemRepository.insert).toHaveBeenCalled();
    });
  });

  describe('clearCart', () => {
    it(`Deletes the User's CartItem's and returns the DeleteResult of the transaction.`, async () => {
      const result = await cartService.clearCart(mockUser);
      expect(result).toEqual({ raw: [], affected: 1 });
      expect(cartRepository.findOne).toHaveBeenCalledWith({
        where: { user_id: mockUser['id'] }
      });

      expect(cartItemRepository.createQueryBuilder).toHaveBeenCalled();
      expect(cartItemRepository.createQueryBuilder().delete).toHaveBeenCalled();
      expect(cartItemRepository.createQueryBuilder().from).toHaveBeenCalled();
      expect(cartItemRepository.createQueryBuilder().where).toHaveBeenCalled();
      expect(
        cartItemRepository.createQueryBuilder().execute
      ).toHaveBeenCalled();
    });
  });
});
