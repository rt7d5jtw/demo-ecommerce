import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { CategoryRepository } from './category.repository';
import { CategoryService } from './category.service';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<unknown>;
};

const mockCategoryRepository: () => MockType<Repository<any>> = jest.fn(() => ({
  fetch: jest.fn(),
  findOne: jest.fn(),
  createCategory: jest.fn(),
  update: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
}));

describe('CategoryService', () => {
  let categoryService: CategoryService;
  let categoryRepository: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CategoryService,
        { provide: CategoryRepository, useFactory: mockCategoryRepository },
      ],
    }).compile();

    categoryService = module.get<CategoryService>(CategoryService);
    categoryRepository = module.get<CategoryRepository>(CategoryRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetch', () => {
    it('fetches categories by calling categoryRepository and returning categories', async () => {
      categoryRepository.fetch.mockResolvedValue([
        {
          id: 'a47ba957-a742-45de-8610-13ba3e0ba4a0',
          cname: 'chocolate',
        },
      ]);
      expect(await categoryService.fetch({ search: 'chocolate' })).toEqual([
        {
          id: 'a47ba957-a742-45de-8610-13ba3e0ba4a0',
          cname: 'chocolate',
        },
      ]);
      expect(await categoryRepository.fetch).toHaveBeenCalledWith({ search: 'chocolate' });
    });
  });

  describe('create', () => {
    it('creates a category by calling categoryRepository and returns it', async () => {
      categoryRepository.createCategory.mockResolvedValue({
        id: uuid(),
        cname: 'test',
      });
      expect(await categoryService.create({ cname: 'test' })).toEqual({
        id: expect.any(String),
        cname: 'test',
      });
      expect(await categoryRepository.createCategory).toHaveBeenCalledWith({ cname: 'test' });
    });
  });

  describe('update', () => {
    it('updates a category by findOne and updating the cname attribute of found category and returns it', async () => {
      categoryRepository.findOne.mockResolvedValue({
        id: 'a49ba957-a742-45de-8610-13ba3e0ba4a0',
        cname: 'classics',
      });
      categoryRepository.save.mockResolvedValue({
        id: 'a49ba957-a742-45de-8610-13ba3e0ba4a0',
        cname: 'test',
      });

      expect(
        await categoryService.update('a49ba957-a742-45de-8610-13ba3e0ba4a0', { cname: 'test' })
      ).toEqual({
        id: 'a49ba957-a742-45de-8610-13ba3e0ba4a0',
        cname: 'test',
      });
      expect(await categoryRepository.findOne).toHaveBeenCalledWith(
        'a49ba957-a742-45de-8610-13ba3e0ba4a0'
      );
      expect(await categoryRepository.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('calls categoryRepository.delete to delete a category', async () => {
      categoryRepository.delete.mockResolvedValue({ affected: 1 });
      expect(await categoryService.remove('f56c7b84-ee72-4767-9733-6f31e5ad0141')).toBeUndefined();
      expect(categoryRepository.delete).toHaveBeenCalledWith(
        'f56c7b84-ee72-4767-9733-6f31e5ad0141'
      );
    });

    it('throws an error for not finding the category', async () => {
      categoryRepository.delete.mockResolvedValue({ affected: 0 });
      await expect(categoryService.remove('dcaa9f09-0dbe-4e81-af92-e15ee487beaa')).rejects.toThrow(
        NotFoundException
      );
      expect(categoryRepository.delete).toHaveBeenCalledWith(
        'dcaa9f09-0dbe-4e81-af92-e15ee487beaa'
      );
    });
  });
});
