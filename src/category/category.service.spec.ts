import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from '../orders/order.entity';
import { OrdersRepositoryExtended } from '../orders/orders.repository';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
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
  let categoryRepository: Repository<Order> & OrdersRepositoryExtended;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(Order),
          useFactory: mockCategoryRepository,
        },
      ],
    }).compile();

    categoryService = module.get<CategoryService>(CategoryService);
    categoryRepository = module.get<Repository<Order> & OrdersRepositoryExtended>(
      getRepositoryToken(Order)
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetch', () => {
    it('fetches categories by calling categoryRepository and returning categories', async () => {
      jest.spyOn(categoryRepository, 'fetch').mockResolvedValue([
        {
          id: 'a47ba957-a742-45de-8610-13ba3e0ba4a0',
          cname: 'chocolate',
        },
      ] as unknown as Order[]);
      expect(await categoryService.fetch({ search: 'chocolate' })).toEqual([
        {
          id: 'a47ba957-a742-45de-8610-13ba3e0ba4a0',
          cname: 'chocolate',
        },
      ]);
      expect(categoryRepository.fetch).toHaveBeenCalledWith({ search: 'chocolate' });
    });
  });

  describe('update', () => {
    it('updates a category by findOne and updating the cname attribute of found category and returns it', async () => {
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue({
        id: 'a49ba957-a742-45de-8610-13ba3e0ba4a0',
        cname: 'classics',
      } as unknown as Order);
      jest.spyOn(categoryRepository, 'save').mockResolvedValue({
        id: 'a49ba957-a742-45de-8610-13ba3e0ba4a0',
        cname: 'test',
      } as unknown as Order);

      expect(
        await categoryService.update('a49ba957-a742-45de-8610-13ba3e0ba4a0', { cname: 'test' })
      ).toEqual({
        id: 'a49ba957-a742-45de-8610-13ba3e0ba4a0',
        cname: 'test',
      });
      expect(categoryRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'a49ba957-a742-45de-8610-13ba3e0ba4a0' },
      });
      expect(categoryRepository.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('calls categoryRepository.delete to delete a category', async () => {
      jest.spyOn(categoryRepository, 'delete').mockResolvedValue({ affected: 1, raw: '' });
      expect(await categoryService.remove('f56c7b84-ee72-4767-9733-6f31e5ad0141')).toBeUndefined();
      expect(categoryRepository.delete).toHaveBeenCalledWith(
        'f56c7b84-ee72-4767-9733-6f31e5ad0141'
      );
    });

    it('throws an error for not finding the category', async () => {
      jest.spyOn(categoryRepository, 'delete').mockResolvedValue({ affected: 0, raw: '' });
      await expect(categoryService.remove('dcaa9f09-0dbe-4e81-af92-e15ee487beaa')).rejects.toThrow(
        NotFoundException
      );
      expect(categoryRepository.delete).toHaveBeenCalledWith(
        'dcaa9f09-0dbe-4e81-af92-e15ee487beaa'
      );
    });
  });
});
