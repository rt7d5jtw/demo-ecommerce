import { rest } from 'msw';
import { PRODUCT_URL } from '../product/api';
import { AUTH_URL, USERS_URL } from '../user/api';
import { PROMOTION_URL } from '../promotion/api';
import { UserRole } from '../user/userSlice';

export const handlers = [
  rest.post(USERS_URL, (_req, res, ctx) => {
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

  rest.post(AUTH_URL, (_req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1pdW1hdUBnbWFpbC5jb20iLCJpYXQiOjE2MjQ5NzkzMDUsImV4cCI6MTYyNDk4MjkwNX0.OQhV3h3KOVKKOYmYgtmyMK8aWjNvWiY5VZ4Yx_xCuCw',
      })
    );
  }),

  rest.get(USERS_URL + 'role', (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(UserRole.USER));
  }),

  rest.patch(USERS_URL + 'changepw', (_req, res, ctx) => {
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

  rest.patch(USERS_URL + 'email', (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json('yeet@mageet.com'));
  }),

  rest.get(USERS_URL, (_req, res, ctx) => {
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

  rest.get(PRODUCT_URL, (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: 8,
          categoryId: 'dcaa9f09-0dbe-4e81-af92-e15ee487beaa',
          title: 'Dune',
          image: 'https://i.imgur.com/Hiw0N.jpg',
          price: 12,
          author: 'Bob',
          description: 'nice boek',
          status: 'IN_STOCK',
          createdAt: '2021-04-30T15:44:28.491Z',
          updatedAt: '2021-04-30T15:44:28.491Z',
        },
      ])
    );
  }),

  rest.post(PRODUCT_URL, (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        title: 'chocolate',
        image: 'https://i.imgur.com/Hiw0N.jpg',
        price: '9.50',
        description: 'i like chocolate',
        status: 'IN_STOCK',
        author: 'Herbert',
        categoryId: 'dcaa9f09-0dbe-4e81-af92-e15ee487beaa',
        id: 27,
        createdAt: '2021-07-02',
        updatedAt: '2021-07-02',
      })
    );
  }),

  rest.delete(PRODUCT_URL + `/20`, (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(undefined));
  }),

  rest.patch(PRODUCT_URL + `/19`, (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: 19,
        categoryId: 'dcaa9f09-0dbe-4e81-af92-e15ee487beaa',
        title: 'Ciabatta',
        image: 'https://i.imgur.com/dNr0ndm.jpg',
        price: '1.5',
        description: 'a tasty ciabatta',
        status: 'IN_STOCK',
        createdAt: '2021-07-02',
        updatedAt: '2021-07-02',
      })
    );
  }),

  rest.get(PRODUCT_URL, (req, res, ctx) => {
    const query = req.url.searchParams;
    const search = query.get('Dune');
    return res(
      ctx.status(200),
      ctx.json({
        search: 'Dune',
        data: [
          {
            id: 8,
            categoryId: 'dcaa9f09-0dbe-4e81-af92-e15ee487beaa',
            title: 'Dune',
            image: 'https://i.imgur.com/Hiw0N.jpg',
            price: 12,
            author: 'Bob',
            description: 'nice boek',
            status: 'IN_STOCK',
            createdAt: '2021-07-02',
            updatedAt: '2021-07-02',
          },
        ],
      })
    );
  }),

  rest.get(PROMOTION_URL, (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: 1,
          title: 'test',
          url: '/testing',
          image: 'https://i.imgur.com/ZgD7uRS.png',
        },
        {
          id: 2,
          title: 'outlet20',
          url: '/outlet',
          image: 'https://i.imgur.com/mIxAqbE.png',
        },
      ])
    );
  }),

  rest.post(PROMOTION_URL, (_req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        title: 'capybara',
        url: '/no-url',
        image: 'https://i.imgur.com/b5Yb264.jpeg',
        id: Math.floor(Math.random() * (100 - 1 + 1) + 1),
      })
    );
  }),

  rest.delete(PROMOTION_URL + `/4`, (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(undefined));
  }),

  rest.patch(PROMOTION_URL + `/10`, (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: 10,
        title: 'i like chocolate',
        url: 'chocolate',
        image: 'https://i.imgur.com/lGlD5Aa.jpeg',
      })
    );
  }),
];
