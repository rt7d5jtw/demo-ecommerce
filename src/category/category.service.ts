import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { SearchCategoryDto, CreateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>
  ) {}

  /**
   * @param {SearchCategoryDto} searchCategoryDto - Optional search parameters.
   * @returns {Promise<Category[]>} Returns array of categories.
   */
  async fetch(searchCategoryDto: SearchCategoryDto): Promise<Category[]> {
    const query = this.categoryRepository.createQueryBuilder('category');

    if (searchCategoryDto.search) {
      query.where('category.cname LIKE :search', {
        search: `%${searchCategoryDto.search}%`
      });
    }

    const categories = await query.getMany();

    return categories;
  }

  /**
   * Creates a new Category by invoking categoryRepository.create,
   * assigning "cname" (category name) from the CreateCategoryDto inputs
   * and persisting it by invoking categoryRepository.save, finally returns it.
   * @param {CreateCategoryDto} createCategoryDto - Category name (cname), input for the new Category to be created.
   * @return {Promise<Category>} Returns the new Category that was created.
   */
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { cname } = createCategoryDto;

    const newCategory = this.categoryRepository.create();
    newCategory.cname = cname;

    if (cname.length === 0)
      throw new NotFoundException('Missing argument or invalid argument');

    await this.categoryRepository.save(newCategory);

    return newCategory;
  }

  /**
   * @param {string} id - ID of the Category to be updated.
   * @param {CreateCategoryDto} createCategoryDto - Inputs for updating a category.
   * @returns {Promise<Category>} Returns the category which was updated.
   */
  async update(
    id: string,
    createCategoryDto: CreateCategoryDto
  ): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id: id }
    });

    if (!category)
      throw new NotFoundException(`No category found with "${id}"`);

    category.cname = createCategoryDto.cname;

    if (createCategoryDto.cname.length === 0)
      throw new NotFoundException('Missing argument or invalid argument');

    await this.categoryRepository.save(category);

    return category;
  }

  /**
   * Removes the category by calling categoryRepository.delete.
   * @param {string} id - ID of the Category to be removed.
   * @returns {Promise<void>}
   */
  async remove(id: string): Promise<void> {
    const category = await this.categoryRepository.delete(id);

    if (category.affected === 0) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }
  }
}
