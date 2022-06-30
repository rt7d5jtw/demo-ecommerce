import { Category } from './category.entity';
import { CreateCategoryDto, SearchCategoryDto } from './dto/category.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { AppDataSource } from '../config/typeorm.config';
import { Repository } from 'typeorm';

interface CategoryRepositoryExtended {
  fetch: (arg0: SearchCategoryDto) => Promise<Category[]>;
  createCategory: (arg0: CreateCategoryDto) => Promise<Category>;
}

const CategoryRepository: Repository<Category> & CategoryRepositoryExtended =
  AppDataSource.getRepository(Category).extend({
    async fetch(searchCategoryDto: SearchCategoryDto): Promise<Category[]> {
      const { search } = searchCategoryDto;
      const query = this.createQueryBuilder('category');

      if (search) {
        query.where('category.cname LIKE :search', { search: `%${search}%` });
      }

      const categories = await query.getMany();
      return categories;
    },

    async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
      const { cname } = createCategoryDto;
      const category = new Category();
      category.cname = cname;
      if (cname.length === 0) {
        throw new NotFoundException('Missing argument or invalid argument');
      }
      await category.save();

      return category;
    },
  });

export { CategoryRepository, CategoryRepositoryExtended };
