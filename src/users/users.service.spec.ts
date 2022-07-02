import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import * as Testdata from '../../test/testdata.json';
//jest.mock('./user.entity'); // Mocking User for validateUserPassword test

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:
  jest.clearAllMocks();
});

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository: Repository<User>;

  const mockUserRepository = () => ({
    fetch: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue({
      andWhere: jest.fn(),
      getMany: jest.fn().mockResolvedValue(Testdata.bunchOfOrders)
    }),
    create: jest.fn().mockImplementation(() => new User()),
    save: jest.fn()
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: mockUserRepository
        }
      ]
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockUser = new User();
  mockUser.id = '872f17ee-45a2-409b-b74a-eea6753f38fb';
  mockUser.email = 'miumau@gmail.com';
  mockUser.password = 'yeetmageet123';

  describe('fetch', () => {
    it("calls userRepository.createQueryBuilder and queries for users based on role and/or query string if they're inputted", async () => {
      const result = await usersService.fetch(null);
      expect(result).toEqual([
        {
          id: expect.any(String),
          email: expect.any(String)
        },
        {
          id: expect.any(String),
          email: expect.any(String)
        },
        {
          id: expect.any(String),
          email: expect.any(String)
        }
      ]);
      expect(userRepository.createQueryBuilder).toHaveBeenCalledWith('user');
      expect(userRepository.createQueryBuilder().getMany).toHaveBeenCalled();
    });

    describe('fetchById', () => {
      it('calls userRepository.findOne and returns a user', async () => {
        jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
        const result = await usersService.fetchById(
          '872f17ee-45a2-409b-b74a-eea6753f38fb'
        );
        expect(result).toEqual({
          id: expect.any(String),
          email: expect.any(String),
          password: expect.any(String)
        });
        expect(userRepository.findOne).toHaveBeenCalledWith({
          where: { id: mockUser.id }
        });
      });

      it('throws an error as user is not found', () => {
        jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
        expect(usersService.fetchById(mockUser.id)).rejects.toThrow(
          NotFoundException
        );
      });
    });

    describe('createUser', () => {
      it('calls the userRepository.create, bcrypt.genSalt, usersService.hashPassword and userRepository.save, finally returns a user', async () => {
        jest.spyOn(bcrypt, 'genSalt');
        jest.spyOn(usersService, 'hashPassword');
        const createUserDto = {
          email: 'test@testing.com',
          password: 'yeetmageet123'
        };
        jest.spyOn(userRepository, 'create').mockImplementation(() => {
          const user = new User();
          user.id = uuid();
          user.createdAt = new Date();
          return user;
        });

        expect(await usersService.createUser(createUserDto)).toEqual({
          salt: expect.any(String),
          password: expect.any(String),
          email: expect.any(String),
          role: expect.any(String),
          id: expect.any(String),
          createdAt: expect.any(Date)
        });
        expect(userRepository.create).toHaveBeenCalled();
        expect(bcrypt.genSalt).toHaveBeenCalled();
        expect(usersService.hashPassword).toHaveBeenCalled();
        expect(userRepository.save).toHaveBeenCalled();
      });
    });

    describe('validateUserPassword', () => {
      it('calls userRepository.findOne and user.validateUserPassword and returns user.email', async () => {
        jest.spyOn(User.prototype, 'validatePassword').mockResolvedValue(true);
        jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
        expect(
          await usersService.validateUserPassword({
            email: mockUser.email,
            password: mockUser.password
          })
        ).toEqual(mockUser.email);
        expect(userRepository.findOne).toHaveBeenCalledWith({
          where: { email: mockUser.email }
        });
        expect(User.prototype.validatePassword).toHaveBeenCalledWith(
          Testdata.loginDto['password']
        );
      });
    });

    describe('remove', () => {
      it('calls userRepository.delete() to delete a user and returns void', async () => {
        jest
          .spyOn(userRepository, 'delete')
          .mockResolvedValue({ affected: 1, raw: '' });
        expect(userRepository.delete).not.toHaveBeenCalled();
        await usersService.remove(mockUser.id);
        expect(userRepository.delete).toHaveBeenCalledWith(mockUser.id);
      });

      it('throws an error as user with that id could not be found', () => {
        jest
          .spyOn(userRepository, 'delete')
          .mockResolvedValue({ affected: 0, raw: '' });
        expect(usersService.remove(mockUser.id)).rejects.toThrow(
          NotFoundException
        );
      });
    });
  });
});
