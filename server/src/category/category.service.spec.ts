import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryService } from './category.service';
import { Category } from './category.entity';
import * as Testdata from '../../test/testdata.json';
import { v4 } from 'uuid';

const mockCategoryRepository = () => ({
  findOne: jest.fn(),
  create: jest.fn(() => {
    const cat = new Category();
    cat.id = v4();
    return cat;
  }),
  update: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue({
    where: jest.fn().mockReturnThis(),
    getMany: jest
      .fn()
      .mockResolvedValue(
        Testdata.arrayOfCategories.filter(
          ({ cname }) => cname.includes('Chocolate') == true
        )
      )
  })
});

describe('CategoryService', () => {
  let categoryService: CategoryService;
  let categoryRepository: Repository<Category>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(Category),
          useFactory: mockCategoryRepository
        }
      ]
    }).compile();

    categoryService = module.get<CategoryService>(CategoryService);
    categoryRepository = module.get<Repository<Category>>(
      getRepositoryToken(Category)
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetch', () => {
    it("fetches categories by calling categoryRepository.fetch with 'chocolate' query string added as a search parameter. Returns found categories", async () => {
      // Mocks a http request with 'chocolate' query string
      // http://localhost:8080/category&chocolate
      // 1. Calls createQueryBuilder
      // 2. If there is a query string, calls createQueryBuilder.where('category.cname LIKE :search')
      // 3. query.getMany() is called and returned;
      //jest.spyOn(categoryRepository, 'createQueryBuilder').mockReturnThis();

      // Testdata.arrayOfCategories is filtered by getting only the
      // categories that have the cname property that has 'Chocolate'.

      const result = await categoryService.fetch({ search: 'chocolate' });
      expect(result).toBeInstanceOf(Array);
      expect(result).toMatchObject([
        {
          cname: expect.any(String),
          id: expect.any(String)
        },
        {
          cname: expect.any(String),
          id: expect.any(String)
        },
        {
          cname: expect.any(String),
          id: expect.any(String)
        },
        {
          cname: expect.any(String),
          id: expect.any(String)
        }
      ]);
      expect(categoryRepository.createQueryBuilder).toHaveBeenCalledWith(
        'category'
      );
      expect(categoryRepository.createQueryBuilder().where).toHaveBeenCalled();
      expect(
        categoryRepository.createQueryBuilder().getMany
      ).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it(`
    Creates a new Category by invoking categoryRepository.create,
    assigning "cname" (category name) from the CreateCategoryDto inputs
    and persisting it by invoking categoryRepository.save, finally returns it.
      `, async () => {
      const result = await categoryService.create({ cname: 'worstsellers' });
      expect(result).toEqual({
        cname: 'worstsellers',
        id: expect.any(String)
      });
      expect(categoryRepository.create).toHaveBeenCalled();
      expect(categoryRepository.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('updates a category by findOne and updating the cname attribute of found category and returns it', async () => {
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue({
        id: 'a49ba957-a742-45de-8610-13ba3e0ba4a0',
        cname: 'classics'
      } as Category);

      expect(
        await categoryService.update('a49ba957-a742-45de-8610-13ba3e0ba4a0', {
          cname: 'test'
        })
      ).toEqual({
        id: 'a49ba957-a742-45de-8610-13ba3e0ba4a0',
        cname: 'test'
      });
      expect(categoryRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'a49ba957-a742-45de-8610-13ba3e0ba4a0' }
      });
      expect(categoryRepository.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('calls categoryRepository.delete to delete a category', async () => {
      jest
        .spyOn(categoryRepository, 'delete')
        .mockResolvedValue({ affected: 1, raw: '' });

      expect(
        await categoryService.remove('f56c7b84-ee72-4767-9733-6f31e5ad0141')
      ).toBeUndefined();

      expect(categoryRepository.delete).toHaveBeenCalledWith(
        'f56c7b84-ee72-4767-9733-6f31e5ad0141'
      );
    });

    it('throws an error for not finding the category', async () => {
      jest
        .spyOn(categoryRepository, 'delete')
        .mockResolvedValue({ affected: 0, raw: '' });

      expect(
        categoryService.remove('dcaa9f09-0dbe-4e81-af92-e15ee487beaa')
      ).rejects.toThrow(NotFoundException);
      expect(categoryRepository.delete).toHaveBeenCalledWith(
        'dcaa9f09-0dbe-4e81-af92-e15ee487beaa'
      );
    });
  });
});
