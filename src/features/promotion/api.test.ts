import { rest } from 'msw';
import { server } from '../mocks/server';
import {
  PROMOTION_URL,
  fetchPromotions,
  createPromotion,
  removePromotion,
  updatePromotion,
} from './api';

describe('Promotions API unit tests', () => {
  describe('fetchPromotions', () => {
    it('returns promotions array', async () => {
      const result = await fetchPromotions();
      expect(result).toEqual(
        expect.arrayContaining([
          {
            id: 1,
            title: expect.any(String),
            url: expect.any(String),
            image: expect.any(String),
          },
          {
            id: 2,
            title: expect.any(String),
            url: expect.any(String),
            image: expect.any(String),
          },
        ])
      );
    });

    it('throws an error', async () => {
      server.use(
        rest.get(PROMOTION_URL, (_req, res, ctx) => {
          return res(
            ctx.status(401),
            ctx.json({
              statusCode: 401,
              message: 'Unauthorized',
            })
          );
        })
      );
      expect(fetchPromotions()).rejects.toThrow('401');
    });
  });

  describe('createPromotion', () => {
    const arg = { title: 'capybara', url: '/no-url', image: 'https://i.imgur.com/b5Yb264.jpeg' };
    it('returns the created promotion', async () => {
      const result = await createPromotion(arg);
      expect(result).toEqual({
        title: 'capybara',
        url: '/no-url',
        image: 'https://i.imgur.com/b5Yb264.jpeg',
        id: expect.any(Number),
      });
    });

    it('throws an error', async () => {
      server.use(
        rest.post(PROMOTION_URL, (_req, res, ctx) => {
          return res(
            ctx.status(422),
            ctx.json({
              statusCode: 422,
              message: 'Missing data from request',
              error: 'Unprocessable Entity',
            })
          );
        })
      );
      const argCopy = JSON.parse(JSON.stringify(arg));
      Object.assign(arg, argCopy);
      delete argCopy.image;
      expect(createPromotion(arg)).rejects.toThrow('422');
    });
  });

  describe('removePromotion', () => {
    it('deletes a promotion and returns void', async () => {
      await expect(removePromotion(4)).resolves.toBeUndefined();
    });

    it('throws an error', async () => {
      server.use(
        rest.delete(PROMOTION_URL + `/15`, (_req, res, ctx) => {
          return res(
            ctx.status(404),
            ctx.json({
              statusCode: 404,
              message: 'Promotion with ID "15" not found',
              error: 'Not Found',
            })
          );
        })
      );
      expect(removePromotion(15)).rejects.toThrow('404');
    });
  });

  describe('updatePromotion', () => {
    const arg = {
      title: 'i like chocolate',
      url: 'chocolate',
      image: 'https://i.imgur.com/lGlD5Aa.jpeg',
    };
    it('returns updated promotion', async () => {
      const result = await updatePromotion({ id: 10, ...arg });
      expect(result).toEqual({
        id: 10,
        title: 'i like chocolate',
        url: 'chocolate',
        image: 'https://i.imgur.com/lGlD5Aa.jpeg',
      });
    });

    it('throws an error for not providing existing id', async () => {
      server.use(
        rest.patch(PROMOTION_URL + `/11`, (_req, res, ctx) => {
          return res(
            ctx.status(404),
            ctx.json({
              statusCode: 404,
              message: 'Promotion with ID "11" not found',
              error: 'Not Found',
            })
          );
        })
      );
      expect(updatePromotion({ id: 11, ...arg })).rejects.toThrow('404');
    });
  });
});
