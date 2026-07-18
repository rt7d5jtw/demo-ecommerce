import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import * as Testdata from '../../test/testdata.json';

// Mocking User for validateUserPassword test
jest.mock('./user.entity');

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository: Repository<User>;

  const mockUserRepository = () => ({
    fetch: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(() => []),
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

  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    jest.clearAllMocks();
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
        expect(result).toMatchObject({
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

    describe('hashPassword', () => {
      it('calls bcrypt.hash to generate a hash', async () => {
        jest.spyOn(bcrypt, 'hash');
        jest.spyOn(usersService, 'hashPassword');
        const result = await usersService.hashPassword(
          'yeetmageet123',
          '$2b$10$l8qAzxpZ1zoRoAT.z9Ew.e'
        );
        expect(result).toMatch(/^\$2[ayb]\$.{56}$/gi);
        expect(usersService.hashPassword).toHaveBeenCalled();
        expect(bcrypt.hash).toHaveBeenCalled();
      });
    });

    describe('createUser', () => {
      it('calls the userRepository.create, bcrypt.genSalt, usersService.hashPassword and userRepository.save, finally returns a user', async () => {
        // Unmock User class so the inherited methods from BaseEntity
        // arent propagated to the User. This makes testing the data properties a pain.

        jest.spyOn(bcrypt, 'genSalt');
        jest.spyOn(usersService, 'hashPassword');
        const createUserDto = {
          email: 'test@testing.com',
          password: 'yeetmageet123'
        };
        jest.spyOn(userRepository, 'create').mockImplementation(() => {
          const user = new User();
          user.id = uuid();
          user.registered_at = new Date();
          return user;
        });

        expect(await usersService.createUser(createUserDto)).toMatchObject({
          salt: expect.any(String),
          password: expect.any(String),
          email: expect.any(String),
          role: expect.any(String),
          id: expect.any(String),
          registered_at: expect.any(Date)
        });
        expect(userRepository.create).toHaveBeenCalled();
        expect(bcrypt.genSalt).toHaveBeenCalled();
        expect(usersService.hashPassword).toHaveBeenCalled();
        expect(userRepository.save).toHaveBeenCalled();
      });
    });

    describe('changePassword', () => {
      // Using another instance to not mess with other tests
      const mockUser2 = new User();
      mockUser2.id = '872f17ee-45a2-409b-b74a-eea6753f38fb';
      mockUser2.email = 'miumau@gmail.com';
      mockUser2.password = 'yeetmageet123';

      // Generates salt for the user.
      // usersService.changePassword uses user.salt property,
      // during the execution of this method.
      beforeAll(async () => (mockUser2.salt = await bcrypt.genSalt()));

      it('Assigns new password from the parameters to user, performs validation through comparisons and user.validatePassword, generates new salt and hash with bcrypt.genSalt and usersService.hashPassword and calls userRepository.save and finally returns current user password', async () => {
        jest.spyOn(bcrypt, 'hash');
        jest.spyOn(bcrypt, 'genSalt');
        jest
          .spyOn(usersService, 'hashPassword')
          .mockImplementation((password, salt) => bcrypt.hash(password, salt));
        jest.spyOn(User.prototype, 'validatePassword').mockResolvedValue(true);

        expect(
          await usersService.changePassword(mockUser2, {
            currentPassword: mockUser2.password,
            newPassword: 'miumau123'
          })
        ).toMatch(/^\$2[ayb]\$.{56}$/);

        expect(User.prototype.validatePassword).toHaveBeenCalled();
        //expect(bcrypt.genSalt).toHaveBeenCalled();
        expect(usersService.hashPassword).toHaveBeenCalled();
        //expect(userRepository.save).toHaveBeenCalledWith(mockUser);
      });
    });

    describe('changeEmail', () => {
      it('Assigns new email address from the parameters to user and calls userRepository.save to persist it to the user, finally returns user.email', async () => {
        expect(
          await usersService.changeEmail(mockUser, {
            currentEmail: 'miumau@gmail.com',
            newEmail: 'yeet@test.com'
          })
        ).toEqual('yeet@test.com');
        expect(userRepository.save).toHaveBeenCalledWith(mockUser);
      });
    });

    describe('updateUserRole', () => {
      it('Calls usersService.fetchById and userRepository.save and returns user.role', async () => {
        jest.spyOn(usersService, 'fetchById').mockResolvedValue(mockUser);
        expect(
          await usersService.updateUserRole(mockUser.id, mockUser.role)
        ).toEqual(mockUser.role);
        expect(usersService.fetchById).toHaveBeenCalledWith(mockUser.id);
        expect(userRepository.save).toHaveBeenCalledWith(mockUser);
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
