import { Test } from '@nestjs/testing';
import { User } from '../users/user.entity';
import { Cart } from './cart.entity';
import { CartRepository } from './cart.repository';

describe('CartRepository', () => {
  let cartRepository: any;

  jest.mock('../users/user.entity');

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [CartRepository],
    }).compile();

    cartRepository = module.get<CartRepository>(CartRepository);
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
      const save = jest.spyOn(Cart, 'getRepository').mockImplementation(() => {
        const original = jest.requireActual('typeorm');
        return {
          ...original,
          save: jest.fn().mockReturnValue(cart),
        };
      });
      await expect(cartRepository.createCart(mockUser)).resolves.toEqual({
        userId: mockUser.id,
        id: expect.any(String),
        CreatedAt: expect.any(String),
      });
      expect(save).toHaveBeenCalled();
    });
  });
});
