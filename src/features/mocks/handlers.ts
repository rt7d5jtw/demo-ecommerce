import { rest } from 'msw';
import { LOGIN_URL, REGISTER_URL } from '../user/api';

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
];
