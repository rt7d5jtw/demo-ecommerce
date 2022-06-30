import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserRepositoryExtended } from './user.repository';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

const bunchOfUsers = [
  {
    id: 'fb962e51-c070-432d-bc3d-b0bcf6e9ecfd',
    email: 'test@testing.com',
  },
  {
    id: 'e6a23d5f-3a23-498f-9f61-ffb9ad34cb68',
    email: 'meemau@gmail.com',
  },
  {
    id: '872f17ee-45a2-409b-b74a-eea6753f38fb',
    email: 'miumau@gmail.com',
  },
];

const mockUserRepository = () => ({
  fetch: jest.fn().mockResolvedValue(bunchOfUsers),
  findOne: jest.fn(),
  createUser: jest.fn().mockResolvedValue({ email: 'test@testing.com', password: 'yeetmageet123' }),
  updateUser: jest.fn(),
  delete: jest.fn(),
  updateUserRole: jest.fn((_id, role) => role),
  validateUserPassword: jest.fn(),
});

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository: Repository<User> & UserRepositoryExtended;

  jest.mock('./user.entity');

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: mockUserRepository,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User> & UserRepositoryExtended>(
      getRepositoryToken(User)
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockUser = new User();
  mockUser.id = '872f17ee-45a2-409b-b74a-eea6753f38fb';
  mockUser.email = 'miumau@gmail.com';
  mockUser.password = 'yeetmageet123';

  describe('fetch', () => {
    it('calls fetch in userRepository', async () => {
      //userRepository.fetch.mockResolvedValue(bunchOfUsers);
      const result = await usersService.fetch(null);
      expect(result).toEqual([
        {
          id: expect.any(String),
          email: expect.any(String),
        },
        {
          id: expect.any(String),
          email: expect.any(String),
        },
        {
          id: expect.any(String),
          email: expect.any(String),
        },
      ]);
    });
  });

  describe('fetchById', () => {
    it('calls userRepository.findOne() and returns a user', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      //userRepository.findOne.mockResolvedValue(mockUser);
      const result = await usersService.fetchById('872f17ee-45a2-409b-b74a-eea6753f38fb');
      expect(result).toEqual({
        id: expect.any(String),
        email: expect.any(String),
        password: expect.any(String),
      });
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: mockUser.id } });
    });

    it('throws an error as user is not found', () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      //userRepository.findOne.mockResolvedValue(null);
      expect(usersService.fetchById(mockUser.id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createUser', () => {
    it('calls the userRepository.create and returns a user', async () => {
      const createUserDto = { email: 'test@testing.com', password: 'yeetmageet123' };
      const result = userRepository.createUser(createUserDto);
      expect(userRepository.createUser).toHaveReturnedWith(result);
    });
  });

  describe('remove', () => {
    it('calls userRepository.delete() to delete a user and returns void', async () => {
      jest.spyOn(userRepository, 'delete').mockResolvedValue({ affected: 1, raw: '' });
      //userRepository.delete.mockResolvedValue({ affected: 1 });
      expect(userRepository.delete).not.toHaveBeenCalled();
      await usersService.remove(mockUser.id);
      expect(userRepository.delete).toHaveBeenCalledWith(mockUser.id);
    });

    it('throws an error as user with that id could not be found', () => {
      jest.spyOn(userRepository, 'delete').mockResolvedValue({ affected: 0, raw: '' });
      //userRepository.delete.mockResolvedValue({ affected: 0 });
      expect(usersService.remove(mockUser.id)).rejects.toThrow(NotFoundException);
    });
  });
});
