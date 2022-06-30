import { Test } from '@nestjs/testing';
import { UserRepositoryExtended } from './user.repository';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

const mockUser = { email: 'test@testing', password: 'yeetmageet123' };

const mockUserRepository = () => ({
  fetch: jest.fn().mockResolvedValue(null),
  findOne: jest.fn(),
  createUser: jest.fn().mockResolvedValue({ email: 'test@testing.com', password: 'yeetmageet123' }),
  updateUser: jest.fn(),
  delete: jest.fn(),
  updateUserRole: jest.fn((_id, role) => role),
  validateUserPassword: jest.fn(),
  hashPassword: jest.fn((data, saltOrRounds) => bcrypt.hash(data, saltOrRounds)),
});

describe('UserRepository', () => {
  let userRepository: Repository<User> & UserRepositoryExtended;
  jest.mock('./user.entity');

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(User),
          useFactory: mockUserRepository,
        },
      ],
    }).compile();

    userRepository = module.get<Repository<User> & UserRepositoryExtended>(
      getRepositoryToken(User)
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    let save: any;
    beforeEach(() => {
      save = jest.fn();
      userRepository.create = jest.fn().mockReturnValue({ save });
    });

    it('Creates a user', () => {
      save.mockResolvedValue(undefined);
      expect(userRepository.createUser(mockUser)).resolves.not.toThrow();
    });
  });

  describe('validateUserPassword', () => {
    let user: any;

    beforeEach(() => {
      userRepository.findOne = jest.fn();
      user = new User();
      user.email = 'test@testing.com';
    });

    it('returns user email on success', async () => {
      jest.spyOn(userRepository, 'validateUserPassword').mockResolvedValue(user);
      const result = await userRepository.validateUserPassword(mockUser);
      expect(result).toEqual({ email: 'test@testing.com' });
    });

    it('returns null if user is invalid', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(userRepository, 'validateUserPassword').mockResolvedValue(null);
      const result = await userRepository.validateUserPassword(mockUser);
      expect(result).toBeNull();
    });

    it('returns null as password is invalid', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(userRepository, 'validateUserPassword').mockResolvedValue(null);
      const result = await userRepository.validateUserPassword(mockUser);
      expect(userRepository.validateUserPassword).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('hashPassword', () => {
    it('calls bcrypt.hash to generate a hash', async () => {
      const result = await userRepository.hashPassword(
        'yeetmageet123',
        '$2b$10$l8qAzxpZ1zoRoAT.z9Ew.e'
      );
      expect(result).toMatch(/^\$2[ayb]\$.{56}$/gi);
      expect(userRepository.hashPassword).toHaveBeenCalled();
    });
  });
});
