import { Test } from '@nestjs/testing';
import { User, UserRole } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const bunchOfUsers = [
  {
    id: 'fb962e51-c070-432d-bc3d-b0bcf6e9ecfd',
    email: 'test@testing.com'
  },
  {
    id: 'e6a23d5f-3a23-498f-9f61-ffb9ad34cb68',
    email: 'meemau@gmail.com'
  },
  {
    id: '872f17ee-45a2-409b-b74a-eea6753f38fb',
    email: 'miumau@gmail.com'
  }
];

const mockUsersService = () => ({
  createUser: jest.fn((dto) => {
    return Promise.resolve({
      salt: '$2b$10$vYZ/YVTnMOwWgDwHSbElb.',
      password: '$2b$10$vYZ/YVTnMOwWgDwHSbElb.K5g0B6Hofa3yqbmZ8LTmggGSJpETDLW',
      email: dto.email,
      role: 'USER',
      id: 'ae65931e-b4a6-451f-9098-ae7be845eb9b',
      createdAt: '2021-07-09'
    });
  }),
  remove: jest.fn(),
  changePassword: jest.fn((_user, { newPassword }) =>
    Promise.resolve(newPassword)
  ),
  changeEmail: jest.fn((_user, { newEmail }) => Promise.resolve(newEmail)),
  fetch: jest.fn(() => Promise.resolve(bunchOfUsers)),
  fetchById: jest.fn(() => {
    return Promise.resolve({
      id: '872f17ee-45a2-409b-b74a-eea6753f38fb',
      email: 'miumau@gmail.com'
    });
  }),
  getRoleByUser: jest.fn(() => Promise.resolve(UserRole.USER)),
  updateUserRole: jest.fn((_id, role) => Promise.resolve(role))
});

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useFactory: mockUsersService
        }
      ]
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const newUser = new User();
  newUser.id = '872f17ee-45a2-409b-b74a-eea6753f38fb';
  newUser.email = 'miumau@gmail.com';
  newUser.password = 'yeetmageet123';

  describe('createUser', () => {
    it('creates a user', async () => {
      const dto = { email: 'miumau@gmail.com', password: 'yeetmageet123' };
      expect(await usersController.createUser(dto)).toEqual({
        salt: expect.any(String),
        password: expect.any(String),
        email: 'miumau@gmail.com',
        role: 'USER',
        id: expect.any(String),
        createdAt: expect.any(String)
      });
    });

    describe('changePassword', () => {
      it("updates user's password and returns updated password", async () => {
        const dto = {
          currentPassword: 'yeetmageet123',
          newPassword: 'potato123'
        };
        expect(await usersController.changePassword(newUser, dto)).toEqual(
          'potato123'
        );
      });
    });

    describe('changeEmail', () => {
      it("updates user's email and returns the new email", async () => {
        const dto = {
          currentEmail: 'miumau@gmail.com',
          newEmail: 'pannukakku@gmail.com'
        };
        expect(await usersController.changeEmail(newUser, dto)).toEqual(
          'pannukakku@gmail.com'
        );
      });
    });

    describe('remove', () => {
      it('deletes a user by calling usersService', async () => {
        expect.assertions(1);
        expect(
          await usersController.remove('872f17ee-45a2-409b-b74a-eea6753f38fb')
        );
        expect(usersService.remove).toHaveBeenCalledWith(
          '872f17ee-45a2-409b-b74a-eea6753f38fb'
        );
      });
    });

    describe('fetch', () => {
      it('gets array of all users', async () => {
        expect(await usersController.fetch(null)).toEqual([
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
      });
    });

    describe('fetchById', () => {
      it('gets a user by id and returns the user', async () => {
        expect(
          await usersController.fetchById(
            '872f17ee-45a2-409b-b74a-eea6753f38fb'
          )
        ).toEqual({
          id: expect.any(String),
          email: expect.any(String)
        });
      });
    });

    describe('getRoleByUser', () => {
      it('gets users role and returns it', async () => {
        await expect(usersController.getRoleByUser(newUser)).resolves.toEqual(
          'USER'
        );
      });
    });

    describe('updateUserRole', () => {
      it("updates user's role to the value specified", async () => {
        expect(
          await usersController.updateUserRole(
            '872f17ee-45a2-409b-b74a-eea6753f38fb',
            UserRole.ADMIN
          )
        ).toEqual('ADMIN');
      });
    });
  });
});
