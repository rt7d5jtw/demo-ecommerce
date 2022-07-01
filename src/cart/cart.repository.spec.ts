import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Cart } from './cart.entity';
import { CartRepositoryExtended } from './cart.repository';

const mockCartRepository = () => ({
  createCart: jest.fn(),
});

describe('CartRepository', () => {
  let cartRepository: Repository<Cart> & CartRepositoryExtended;

  jest.mock('../users/user.entity');

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

  describe('create', () => {
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
});
