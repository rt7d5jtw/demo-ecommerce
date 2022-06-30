import { JwtStrategy } from './jwt-strategy';
import { Test } from '@nestjs/testing';
import { UserRepository, UserRepositoryExtended } from '../users/user.repository';
import { User } from '../users/user.entity';
import { UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

const mockUserRepository = () => ({
  findOne: jest.fn(),
});

describe('JwtStrategy', () => {
  let jwtStrategy: any;
  let userRepository: Repository<User> & UserRepositoryExtended;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: getRepositoryToken(User),
          useFactory: mockUserRepository,
        },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    userRepository = module.get<Repository<User> & UserRepositoryExtended>(
      getRepositoryToken(User)
    );
  });

  describe('validate', () => {
    it('validates and returns the user based on JWT payload', async () => {
      const user = new User();
      user.email = 'test@testing.com';

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      //userRepository.findOne.mockResolvedValue(user);
      const result = await jwtStrategy.validate({ email: 'test@testing.com' });
      expect(result).toEqual(user);
    });

    it('throws an unauthorized exception as user cannot be found', () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      //userRepository.findOne.mockResolvedValue(null);
      expect(jwtStrategy.validate({ email: 'test@testing.com' })).rejects.toThrow(
        UnauthorizedException
      );
    });
  });
});
