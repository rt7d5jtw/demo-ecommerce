import { Test } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

const mockCategoryService = () => ({
  fetch: jest.fn().mockResolvedValue([
    {
      id: 'dcaa9f09-0dbe-4e81-af92-e15ee487beaa',
      cname: 'test'
    },
    {
      id: 'a47ba957-a742-45de-8610-13ba3e0ba4a0',
      cname: 'chocolate'
    },
    {
      id: 'f56c7b84-ee72-4767-9733-6f31e5ad0141',
      cname: 'icecream'
    }
  ]),
  create: jest.fn().mockResolvedValue({
    cname: 'milk',
    id: '12b948c1-e8ed-4db4-a25f-a4937ef58acb'
  }),
  update: jest.fn().mockResolvedValue({
    id: '12b948c1-e8ed-4db4-a25f-a4937ef58acb',
    cname: 'chocolate'
  }),
  remove: jest.fn().mockResolvedValue(undefined)
});

describe('CategoryController', () => {
  let categoryController: CategoryController;
  let categoryService: CategoryService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [{ provide: CategoryService, useFactory: mockCategoryService }]
    }).compile();

    categoryController = module.get<CategoryController>(CategoryController);
    categoryService = module.get<CategoryService>(CategoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetch', () => {
    it('fetches categories by calling categoryService and returns them', async () => {
      expect(await categoryController.fetch(null)).toEqual([
        {
          id: expect.any(String),
          cname: expect.any(String)
        },
        {
          id: expect.any(String),
          cname: expect.any(String)
        },
        {
          id: expect.any(String),
          cname: expect.any(String)
        }
      ]);
      expect(categoryService.fetch).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('creates a category by calling categoryService and returns it', async () => {
      expect(await categoryController.create({ cname: 'test' })).toEqual({
        id: expect.any(String),
        cname: expect.any(String)
      });
      expect(categoryService.create).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('updates category by calling categoryService and returns it', async () => {
      expect(
        await categoryController.update(
          '12b948c1-e8ed-4db4-a25f-a4937ef58acb',
          { cname: 'yeet' }
        )
      ).toEqual({
        id: '12b948c1-e8ed-4db4-a25f-a4937ef58acb',
        cname: 'chocolate'
      });
      expect(categoryService.update).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('removes category by calling categoryService and returns void', async () => {
      expect(
        await categoryController.remove('12b948c1-e8ed-4db4-a25f-a4937ef58acb')
      ).toBeUndefined();
      expect(categoryService.remove).toHaveBeenCalledWith(
        '12b948c1-e8ed-4db4-a25f-a4937ef58acb'
      );
    });
  });
});
