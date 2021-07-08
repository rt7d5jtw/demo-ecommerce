import { Test } from '@nestjs/testing';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const mockUsersService = () => ({
  createUser: jest.fn(),
});

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useFactory: mockUsersService }],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('createUser', () => {
    it('to be implemented', () => {});
  });
});
