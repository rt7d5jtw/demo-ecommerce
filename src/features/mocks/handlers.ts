import { rest } from 'msw';
import { PRODUCT_URL } from '../product/api';
import { AUTH_URL, USERS_URL } from '../user/api';
import { PROMOTION_URL } from '../promotion/api';
import { UserRole } from '../user/userSlice';
import { ORDER_URL } from '../order/api';
import { v4 as uuid } from 'uuid';
import { CATEGORY_URL } from '../category/api';
import { CART_URL } from '../cart/api';

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

  rest.get(ORDER_URL, (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: '8ae45c19-ebf7-4e3b-bc55-8ff1885e925d',
          userId: 'e6a23d5f-3a23-498f-9f61-ffb9ad34cb68',
          total_price: 15,
          address: 'Yeetstreet',
          country: 'Finland',
          city: 'Helsinki',
          postalcode: '01000',
          status: 'PROCESSING',
          date: '2021-07-03',
        },
      ])
    );
  }),

  rest.get(ORDER_URL + 'all', (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: uuid(),
          userId: uuid(),
          total_price: 25,
          address: 'Tamperestreet',
          country: 'Finland',
          city: 'Tampere',
          postalcode: '33270',
          status: 'PROCESSING',
          date: '2021-07-12',
        },
        {
          id: '8ae45c19-ebf7-4e3b-bc55-8ff1885e925d',
          userId: 'e6a23d5f-3a23-498f-9f61-ffb9ad34cb68',
          total_price: 15,
          address: 'Yeetstreet',
          country: 'Finland',
          city: 'Helsinki',
          postalcode: '01000',
          status: 'PROCESSING',
          date: '2021-07-03',
        },
      ])
    );
  }),

  rest.post(ORDER_URL, (_req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        total_price: 35,
        address: 'Yeetstreet',
        country: 'Finland',
        city: 'Helsinki',
        postalcode: '01000',
        status: 'PROCESSING',
        userId: uuid(),
        id: uuid(),
        date: '2021-07-04',
      })
    );
  }),

  rest.post(ORDER_URL + 'items/0302370c-6f80-4932-9dd6-6364d01bf936', (_req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json([
        {
          id: uuid(),
          cartId: uuid(),
          productId: 25,
          quantity: 1,
          price: 7,
          CreatedAt: '2021-07-03',
        },
      ])
    );
  }),

  rest.delete(ORDER_URL + '9f0bcbf5-c845-48ef-95dd-393da9ae64c1', (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(undefined));
  }),

  rest.get(CATEGORY_URL, (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: uuid(),
          cname: 'outlet',
        },
        {
          id: uuid(),
          cname: 'bestsellers',
        },
        {
          id: uuid(),
          cname: 'classics',
        },
      ])
    );
  }),

  rest.post(CATEGORY_URL, (_req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        cname: 'test',
        id: uuid(),
      })
    );
  }),

  rest.delete(CATEGORY_URL + '4a9ad1cc-17b9-4193-8341-7d14194909ad', (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(undefined));
  }),

  rest.patch(CATEGORY_URL + '419b12e1-b406-4cb5-8a2e-082bbab85802', (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: '419b12e1-b406-4cb5-8a2e-082bbab85802',
        cname: 'newTest',
      })
    );
  }),

  rest.get(CART_URL, (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: '8994da04-6065-44af-9fc4-2ad7a2048d2e',
        userId: 'e6a23d5f-3a23-498f-9f61-ffb9ad34cb68',
        CreatedAt: '2021-07-03',
      })
    );
  }),

  rest.post(CART_URL, (_req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        userId: 'e6a23d5f-3a23-498f-9f61-ffb9ad34cb68',
        id: '45738a36-ec14-41b7-ad07-ba3dfbd17580',
        CreatedAt: '2021-07-03',
      })
    );
  }),

  rest.get(CART_URL + 'state', (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          productId: 28,
          title: 'chocolate',
          image: 'https://i.imgur.com/Hiw0N.jpg',
          price: 9.5,
          quantity: 1,
        },
        {
          productId: 20,
          title: 'Burger',
          image: 'https://i.imgur.com/kpu7hRD.jpeg',
          price: 14,
          quantity: 1,
        },
      ])
    );
  }),

  rest.post(CART_URL + 28, (_req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        cartId: '868ffd6e-ef17-4d29-9f04-0072c3d437a1',
        quantity: '1',
        price: 9.5,
        productId: 28,
        id: 'b70ebe60-ae36-4c86-8ae2-310c422ce3b6',
        CreatedAt: '2021-07-03T17:30:46.075Z',
      })
    );
  }),

  rest.delete(CART_URL + 28, (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(undefined));
  }),

  rest.delete(CART_URL, (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(undefined));
  }),
];
