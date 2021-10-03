"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRepository = void 0;
const category_entity_1 = require("./category.entity");
const typeorm_1 = require("typeorm");
const common_1 = require("@nestjs/common");
let CategoryRepository = class CategoryRepository extends typeorm_1.Repository {
    async fetch(searchCategoryDto) {
        const { search } = searchCategoryDto;
        const query = this.createQueryBuilder('category');
        if (search) {
            query.where('category.cname LIKE :search', { search: `%${search}%` });
        }
        const categories = await query.getMany();
        return categories;
    }
    async createCategory(createCategoryDto) {
        const { cname } = createCategoryDto;
        const category = new category_entity_1.Category();
        category.cname = cname;
        if (cname.length === 0) {
            throw new common_1.NotFoundException('Missing argument or invalid argument');
        }
        await category.save();
        return category;
    }
};
CategoryRepository = __decorate([
    typeorm_1.EntityRepository(category_entity_1.Category)
], CategoryRepository);
exports.CategoryRepository = CategoryRepository;
//# sourceMappingURL=category.repository.js.map