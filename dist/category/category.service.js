"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const category_repository_1 = require("./category.repository");
let CategoryService = class CategoryService {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    async fetch(searchCategoryDto) {
        return this.categoryRepository.fetch(searchCategoryDto);
    }
    async create(createCategoryDto) {
        return this.categoryRepository.createCategory(createCategoryDto);
    }
    async update(id, createCategoryDto) {
        const { cname } = createCategoryDto;
        const category = await this.categoryRepository.findOne(id);
        if (!category) {
            throw new common_1.NotFoundException(`No category found with "${id}"`);
        }
        category.cname = cname;
        if (cname.length === 0) {
            throw new common_1.NotFoundException('Missing argument or invalid argument');
        }
        await this.categoryRepository.save(category);
        return category;
    }
    async remove(id) {
        const category = await this.categoryRepository.delete(id);
        if (category.affected === 0) {
            throw new common_1.NotFoundException(`Category with ID "${id}" not found`);
        }
    }
};
CategoryService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(category_repository_1.CategoryRepository)),
    __metadata("design:paramtypes", [category_repository_1.CategoryRepository])
], CategoryService);
exports.CategoryService = CategoryService;
//# sourceMappingURL=category.service.js.map