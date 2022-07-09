import { rest } from 'msw';
import { server } from '../mocks/server';
import {
  fetchAllUsers,
  fetchRole,
  login,
  AUTH_URL,
  register,
  USERS_URL,
  updateEmail,
  updatePassword,
} from './api';
import { UserRole } from './userSlice';

describe('User API Unit tests', () => {
  const arg = { email: 'test@testing.com', password: 'yeetmageet123' };

  describe('register', () => {
    it("calls api to register a user and returns a user's id and email", async () => {
      const regex = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
      const result = await register(arg);
      expect(result).toEqual({
        email: 'test@testing.com',
        id: expect.any(String),
      });
      expect(regex.test(result.id)).toEqual(true);
    });

    it('throws an error for not providing correct email', async () => {
      server.use(
        rest.post(USERS_URL, (_req, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json({
              message: ['email must be an email'],
              error: 'Bad Request',
            })
          );
        })
      );
      expect(
        register({ email: 'notproperemail', password: 'yeetmageet123' })
      ).rejects.toThrow('400');
    });
  });

  describe('login', () => {
    const regex = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/i;
    it('calls api with user credentials and returns JWT token', async () => {
      const result = await login(arg);
      expect(result).toMatch(regex);
      expect(regex.test(result)).toEqual(true);
    });

    it('throws an error for incorrect email', async () => {
      server.use(
        rest.post(AUTH_URL, (_req, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json({
              statusCode: 400,
              message: ['email must be an email'],
              error: 'Bad Request',
            })
          );
        })
      );
      expect(
        login({ email: 'notproperemail', password: 'yeetmageet123' })
      ).rejects.toThrow('400');
    });
  });

  describe('fetchRole', () => {
    it('fetches role of the user', async () => {
      const result = await fetchRole();
      expect(result).toEqual(UserRole.USER);
    });

    it('throws an error', async () => {
      server.use(
        rest.get(USERS_URL + 'role', (_req, res, ctx) => {
          return res(
            ctx.status(401),
            ctx.json({
              statusCode: 401,
              message: 'Unauthorized',
            })
          );
        })
      );
      expect(fetchRole()).rejects.toThrow('401');
    });
  });

  describe('updatePassword', () => {
    it('updates user password', async () => {
      const result = await updatePassword({
        currentPassword: 'yeetmageet123',
        newPassword: 'yeetmageet1234',
      });
      expect(result).toEqual({
        id: expect.any(String),
        email: 'test@testing.com',
        password: expect.any(String),
        role: expect.any(String),
        salt: expect.any(String),
        createdAt: expect.any(String),
        orders: [],
      });
    });

    it('throws an error', async () => {
      server.use(
        rest.patch(USERS_URL + 'changepw', (_req, res, ctx) => {
          return res(
            ctx.status(409),
            ctx.json({
              statusCode: 409,
              message: 'Validation failed',
              error: 'Conflict',
            })
          );
        })
      );
      expect(
        updatePassword({
          currentPassword: 'wrongpassword',
          newPassword: 'yeetmageet098',
        })
      ).rejects.toThrow('409');
    });
  });

  describe('updateEmail', () => {
    const arg = {
      currentEmail: 'test@testing.com',
      newEmail: 'yeet@mageet.com',
    };
    it('change user email', async () => {
      const result = await updateEmail(arg);
      expect(result).toEqual('yeet@mageet.com');
    });

    it('throws an error', async () => {
      server.use(
        rest.patch(USERS_URL + 'email', (_req, res, ctx) => {
          return res(
            ctx.status(409),
            ctx.json({
              statusCode: 409,
              message: 'Emails conflict',
              error: 'Conflict',
            })
          );
        })
      );
      expect(updateEmail(arg)).rejects.toThrow('409');
    });
  });

  describe('fetchAllUsers', () => {
    const usersArr = [
      {
        id: '255c8982-4257-407d-b002-1e76dac3a075',
        email: 'meemau@gmail.com',
        password:
          '$2b$10$9YsWW.gyD8Mz7zV8uUhrae7DfO9dWcvVYQaDWtvxBq5b29AVzKWHW',
        role: 'ADMIN',
        salt: '$2b$10$9YsWW.gyD8Mz7zV8uUhrae',
        createdAt: '2021-04-24',
      },
      {
        id: '4ec9270a-0c72-4675-93be-ba850f2ea5fb',
        email: 'test@testing.com',
        password:
          '$2b$10$E29I6Vgu2vIwV8PVcWEfie/HnmB.pByNfpmonMAL99qb730VaxtO.',
        role: 'USER',
        salt: '$2b$10$E29I6Vgu2vIwV8PVcWEfie',
        createdAt: '2021-06-29',
      },
      {
        id: '872f17ee-45a2-409b-b74a-eea6753f38fb',
        email: 'miumau@gmail.com',
        password:
          '$2b$10$SyzY0wCknTEmvlvKqjP7x.uplLjt42YEXIYhpo0AClLfU0VqGgWh.',
        role: 'USER',
        salt: '$2b$10$SyzY0wCknTEmvlvKqjP7x.',
        createdAt: '2021-06-17',
      },
    ];
    it('returns array of users', async () => {
      const result = await fetchAllUsers();
      expect(result).toEqual(usersArr);
    });
  });
});
