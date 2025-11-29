import { JwtStrategy } from './jwt-strategy';
import { Test } from '@nestjs/testing';
import { User } from '../users/user.entity';
import { UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let userRepository: Repository<User>;

  const mockUserRepository = () => ({
    findOne: jest.fn()
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: getRepositoryToken(User),
          useFactory: mockUserRepository
        }
      ]
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('validate', () => {
    const user = new User();
    user.email = 'test@testing.com';

    it('validates and returns the user based on if user is found from the JWT payload (user email)', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      const testEmail = 'test@testing.com';
      expect(await jwtStrategy.validate({ email: testEmail })).toEqual(user);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: testEmail }
      });
    });

    it('throws an unauthorized exception as user cannot be found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      expect(
        jwtStrategy.validate({ email: 'test@testing.com' })
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
