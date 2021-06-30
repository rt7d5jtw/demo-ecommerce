import { rest } from 'msw';
import { LOGIN_URL, REGISTER_URL } from '../user/api';
import { UserRole } from '../user/userSlice';

export const handlers = [
  rest.post(REGISTER_URL, (_req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        salt: '$2b$10$E29I6Vgu2vIwV8PVcWEfie',
        password: '$2b$10$E29I6Vgu2vIwV8PVcWEfie/HnmB.pByNfpmonMAL99qb730VaxtO.',
        email: 'test@testing.com',
        role: 'USER',
        id: '4ec9270a-0c72-4675-93be-ba850f2ea5fb',
        createdAt: '2021-06-29',
      })
    );
  }),

  rest.post(LOGIN_URL, (_req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1pdW1hdUBnbWFpbC5jb20iLCJpYXQiOjE2MjQ5NzkzMDUsImV4cCI6MTYyNDk4MjkwNX0.OQhV3h3KOVKKOYmYgtmyMK8aWjNvWiY5VZ4Yx_xCuCw',
      })
    );
  }),

  rest.get(REGISTER_URL + 'role', (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(UserRole.USER));
  }),

  rest.patch(REGISTER_URL + 'changepw', (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: '872f17ee-45a2-409b-b74a-eea6753f38fb',
        email: 'test@testing.com',
        password: '$2b$10$AGAshzYOtaaMrxTNdxVwyeC4iRp3JIXT/LMEGBi5RErDHCBH9lSu.',
        role: 'USER',
        salt: '$2b$10$AGAshzYOtaaMrxTNdxVwye',
        createdAt: '2021-06-17',
        orders: [],
      })
    );
  }),

  rest.patch(REGISTER_URL + 'email', (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json('yeet@mageet.com'));
  }),

  rest.get(REGISTER_URL, (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: '255c8982-4257-407d-b002-1e76dac3a075',
          email: 'meemau@gmail.com',
          password: '$2b$10$9YsWW.gyD8Mz7zV8uUhrae7DfO9dWcvVYQaDWtvxBq5b29AVzKWHW',
          role: 'ADMIN',
          salt: '$2b$10$9YsWW.gyD8Mz7zV8uUhrae',
          createdAt: '2021-04-24',
        },
        {
          id: '4ec9270a-0c72-4675-93be-ba850f2ea5fb',
          email: 'test@testing.com',
          password: '$2b$10$E29I6Vgu2vIwV8PVcWEfie/HnmB.pByNfpmonMAL99qb730VaxtO.',
          role: 'USER',
          salt: '$2b$10$E29I6Vgu2vIwV8PVcWEfie',
          createdAt: '2021-06-29',
        },
        {
          id: '872f17ee-45a2-409b-b74a-eea6753f38fb',
          email: 'miumau@gmail.com',
          password: '$2b$10$SyzY0wCknTEmvlvKqjP7x.uplLjt42YEXIYhpo0AClLfU0VqGgWh.',
          role: 'USER',
          salt: '$2b$10$SyzY0wCknTEmvlvKqjP7x.',
          createdAt: '2021-06-17',
        },
      ])
    );
  }),
];
