import { rest } from 'msw';
import { server } from '../mocks/server';
import {
  CATEGORY_URL,
  createCategory,
  fetchCategories,
  removeCategory,
  updateCategory,
} from './api';

describe('Category API unit tests', () => {
  const uuidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
  describe('fetchCategories', () => {
    it('returns categories', async () => {
      const result = await fetchCategories();
      expect(result).toEqual(
        expect.arrayContaining([
          {
            id: expect.any(String),
            cname: expect.any(String),
          },
          {
            id: expect.any(String),
            cname: expect.any(String),
          },
          {
            id: expect.any(String),
            cname: expect.any(String),
          },
        ])
      );
      expect(uuidRegex.test(result[0].id)).toEqual(true);
      expect(uuidRegex.test(result[1].id)).toEqual(true);
      expect(uuidRegex.test(result[2].id)).toEqual(true);
    });
  });

  describe('createCategory', () => {
    it('creates a new category and returns it', async () => {
      const result = await createCategory('test');
      expect(result).toEqual({
        cname: 'test',
        id: expect.any(String),
      });
      expect(uuidRegex.test(result.id)).toEqual(true);
    });

    it('throws a 404 error for not providing argument', async () => {
      server.use(
        rest.post(CATEGORY_URL, (_req, res, ctx) => {
          return res(
            ctx.status(404),
            ctx.json({
              statusCode: 404,
              message: 'Missing argument or invalid argument',
              error: 'Not Found',
            })
          );
        })
      );
      expect(createCategory('')).rejects.toThrow('404');
    });
  });

  describe('removeCategory', () => {
    it('deletes a category and returns void', async () => {
      await expect(removeCategory('4a9ad1cc-17b9-4193-8341-7d14194909ad')).resolves.toBe('');
    });

    it('throws an error for not providing existing id', async () => {
      server.use(
        rest.delete(CATEGORY_URL + '4a9ad1cc-17b9-4193-8341-7d14194909ad', (_req, res, ctx) => {
          return res(
            ctx.status(404),
            ctx.json({
              statusCode: 404,
              message: 'Category with ID "4a9ad1cc-17b9-4193-8341-7d14194909ad" not found',
              error: 'Not Found',
            })
          );
        })
      );
      expect(removeCategory('4a9ad1cc-17b9-4193-8341-7d14194909ad')).rejects.toThrow('404');
    });
  });

  describe('updateCategory', () => {
    const arg = { id: '419b12e1-b406-4cb5-8a2e-082bbab85802', cname: 'newTest' };
    it('updates a category and returns it', async () => {
      const result = await updateCategory(arg);
      expect(result).toEqual({
        id: expect.any(String),
        cname: expect.any(String),
      });
      expect(uuidRegex.test(result.id)).toEqual(true);
    });

    it('throws an error for not providing existing id', async () => {
      server.use(
        rest.patch(CATEGORY_URL + 'e322da15-d146-46f3-98ce-146749ea2e19', (_req, res, ctx) => {
          return res(
            ctx.status(404),
            ctx.json({
              statusCode: 404,
              message: 'No category found with "e322da15-d146-46f3-98ce-146749ea2e19"',
              error: 'Not Found',
            })
          );
        })
      );
      expect(
        updateCategory({ id: 'e322da15-d146-46f3-98ce-146749ea2e19', cname: 'chocolate' })
      ).rejects.toThrow('404');
    });
  });
});
