import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserRepository } from './user.repository';
import { User, UserRole } from './user.entity';
import { NotFoundException } from '@nestjs/common';

const mockUser: User = {
  id: '872f17ee-45a2-409b-b74a-eea6753f38fb',
  email: 'miumau@gmail.com',
  password: '$2b$10$ZUYZVMqZgk5zDj2wQVdpQ.OQuncE7TauJSFlK7vLdQOfjnrqZNXrm',
  role: UserRole.USER,
  salt: '$2b$10$ZUYZVMqZgk5zDj2wQVdpQ.',
  createdAt: new Date('2021-06-17'),
  orders: [],
  cart: null,
  validatePassword: () => undefined,
  hasId: () => undefined,
  save: () => undefined,
  remove: () => undefined,
  softRemove: () => undefined,
  recover: () => undefined,
  reload: null,
};

const mockUserRepository = () => ({
  getUsers: jest.fn(),
  findOne: jest.fn(),
  createUser: jest.fn(),
  updateUser: jest.fn(),
  delete: jest.fn(),
  changePassword: jest.fn(),
  hashPassword: jest.fn(),
});

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UserRepository, useFactory: mockUserRepository },
      ],
    }).compile()

    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('getUsers', () => {
    it('gets users from the repository', async () => {
      userRepository.getUsers.mockResolvedValue('someValue');
      const result = await usersService.getUsers(null);
      expect(result).toEqual('someValue');
    });
  })

  describe('getUserById', () => {
    it('calls userRepository.findOne() and returns a user', async () => {
      const mockUser2 = {
        id: '255c8982-4257-407d-b002-1e76dac3a075',
        email: 'miumau@gmail.com',
        password: '$2b$10$9YsWW.gyD8Mz7zV8uUhrae7DfO9dWcvVYQaDWtvxBq5b29AVzKWHW',
        role: 'ADMIN',
        salt: '$2b$10$9YsWW.gyD8Mz7zV8uUhrae',
        createdAt: '2021-04-24',
        orders: []
      }
      userRepository.findOne.mockResolvedValue(mockUser2)
      const result = await usersService.getUserById('255c8982-4257-407d-b002-1e76dac3a075');
      expect(result).toEqual(mockUser2);
      expect(userRepository.findOne).toHaveBeenCalledWith(mockUser2.id)
    })

    it('throws an error as user is not found', () => {
      userRepository.findOne.mockResolvedValue(null);
      expect(usersService.getUserById(mockUser.id)).rejects.toThrow(NotFoundException);
    })
  })

  describe('createUser', () => {
    it('calls the userRepository.create and returns a user', async () => {
      const createUserDto = { email: 'test@testing.com', password: 'yeetmageet123' };
      const result = userRepository.createUser(createUserDto);
      expect(userRepository.createUser).toHaveReturnedWith(result);
    })
  })

  describe('deleteUserById', () => {
    it('calls userRepository.delete() to delete a user and returns void', async () => {
      userRepository.delete.mockResolvedValue({ affected: 1 });
      expect(userRepository.delete).not.toHaveBeenCalled();
      await usersService.deleteUserById(mockUser.id);
      expect(userRepository.delete).toHaveBeenCalledWith(mockUser.id);
    })

    it('throws an error as user with that id could not be found', () => {
      userRepository.delete.mockResolvedValue({ affected: 0 });
      expect(usersService.deleteUserById(mockUser.id)).rejects.toThrow(NotFoundException);
    })
  })

  describe('changePassword', () => {
    it('calls userRepository.changePassword to change user\'s password and returns a user', async () => {
      const newSalt = '$2b$10$hRzg3XHVgmsZjPGbya4dme3.QA1ZbpSXz93.MlOlAMlzbKWKU2Lkq';
      const mockUser3 = mockUser;
      mockUser.salt = newSalt;
      const changePasswordDto = { currentPassword: 'habbo123', newPassword: 'habbo1234' };
      userRepository.changePassword.mockResolvedValue(mockUser3);
      const result = await usersService.changePassword(mockUser, changePasswordDto);
      expect(result.salt).toEqual(mockUser3.salt);
    })
  })
})
