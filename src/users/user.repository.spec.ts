import { Test } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { User } from './user.entity';

const mockUser = { email: 'test@testing', password: 'yeetmageet123' };

describe('UserRepository', () => {
  let userRepository: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
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
      user.validatePassword = jest.fn();
    });

    it('returns user email on success', async () => {
      userRepository.findOne.mockResolvedValue(user);
      user.validatePassword.mockResolvedValue(true);
      const result = await userRepository.validateUserPassword(mockUser);
      expect(result).toEqual('test@testing.com');
    });

    it('returns null if user is invalid', async () => {
      userRepository.findOne.mockResolvedValue(null);
      const result = await userRepository.validateUserPassword(mockUser);
      expect(user.validatePassword).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('returns null as password is invalid', async () => {
      userRepository.findOne.mockResolvedValue(user);
      user.validatePassword.mockResolvedValue(false);
      const result = await userRepository.validateUserPassword(mockUser);
      expect(user.validatePassword).toHaveBeenCalled();
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
    });
  });
});
