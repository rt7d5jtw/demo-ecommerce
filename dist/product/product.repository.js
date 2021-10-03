"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepository = void 0;
const common_1 = require("@nestjs/common");
const category_entity_1 = require("../category/category.entity");
const typeorm_1 = require("typeorm");
const product_entity_1 = require("./product.entity");
let ProductRepository = class ProductRepository extends typeorm_1.Repository {
    constructor() {
        super(...arguments);
        this.logger = new common_1.Logger('ProductRepository');
    }
    async fetch(searchProductDto) {
        const { search } = searchProductDto;
        const query = this.createQueryBuilder('product');
        query.select('product');
        query.leftJoinAndSelect('product.categories', 'category');
        if (search) {
            query.andWhere('LOWER(product.title) LIKE LOWER(:search) OR LOWER(product.description) LIKE LOWER(:search)', {
                search: `%${search}%`,
            });
        }
        const products = await query.getMany();
        return products;
    }
    async createProduct(createProductDto) {
        const { title, image, price, description, categoryIds } = createProductDto;
        if (categoryIds.length === 0 || !Array.isArray(categoryIds)) {
            throw new common_1.BadRequestException('Input needs to be an array!');
        }
        const ids = categoryIds.map(({ id }) => id);
        const categories = await typeorm_1.getRepository(category_entity_1.Category)
            .createQueryBuilder('category')
            .where('category.id IN (:...ids)', {
            ids: ids,
        })
            .getMany();
        const product = this.create();
        product.title = title;
        product.image = image;
        product.price = price;
        product.description = description;
        product.status = product_entity_1.ProductStatus.IN_STOCK;
        product.categories = categories;
        try {
            await product.save();
        }
        catch (error) {
            this.logger.error(`Failed to create a product`, error.stack);
        }
        return product;
    }
};
ProductRepository = __decorate([
    typeorm_1.EntityRepository(product_entity_1.Product)
], ProductRepository);
exports.ProductRepository = ProductRepository;
//# sourceMappingURL=product.repository.js.map