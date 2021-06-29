import { rest } from 'msw';
import { login, register, REGISTER_URL } from './api';
import { server } from '../mocks/server';

describe('API Unit tests', () => {
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

    it('throws an error for providing incorrect argument', async () => {
      server.use(
        rest.post(REGISTER_URL, (_req, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json({
              message: ['email must be an email'],
              error: 'Bad Request',
            })
          );
        })
      );
      try {
        await register({ email: 'notproperemail', password: 'yeetmageet123' });
      } catch (err) {
        expect(err).toEqual({
          message: [expect.any(String)],
          error: expect.any(String),
        });
      }
    });
  });

  describe('login', () => {
    const regex = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/i;
    it('calls api with user credentials and returns JWT token', async () => {
      const result = await login(arg);
      expect(result).toEqual({
        accessToken: expect.any(String),
      });
      expect(regex.test(result.accessToken)).toEqual(true);
    });
  });
});
