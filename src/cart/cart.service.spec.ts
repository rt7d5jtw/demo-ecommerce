import { Test } from '@nestjs/testing';
import { MockType } from '../category/category.service.spec';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { CartService } from './cart.service';
import { CartRepositoryExtended } from './cart.repository';
import { Cart } from './cart.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

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
  let cartRepository: Repository<Cart> & CartRepositoryExtended;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: getRepositoryToken(Cart),
          useFactory: mockCartRepository,
        },
      ],
    }).compile();

    cartService = module.get<CartService>(CartService);
    cartRepository = module.get<Repository<Cart> & CartRepositoryExtended>(
      getRepositoryToken(Cart)
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockUser = new User();
  mockUser.id = 'e6a23d5f-3a23-498f-9f61-ffb9ad34cb68';
  mockUser.email = 'miumau@gmail.com';
  mockUser.password = 'yeetmageet123';

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
});
