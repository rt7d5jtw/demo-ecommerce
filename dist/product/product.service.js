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
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const product_repository_1 = require("./product.repository");
const common_2 = require("@nestjs/common");
const typeorm_2 = require("typeorm");
const category_entity_1 = require("../category/category.entity");
let ProductService = class ProductService {
    constructor(productRepository) {
        this.productRepository = productRepository;
        this.logger = new common_2.Logger('ProductController');
    }
    async fetch(searchProductDto) {
        this.logger.verbose(`Retrieving all products`);
        return this.productRepository.fetch(searchProductDto);
    }
    async fetchById(id) {
        const [result] = await this.productRepository.find({
            relations: ['categories'],
            where: { id: id },
        });
        if (!result) {
            throw new common_1.NotFoundException(`Product with ID "${id}" not found`);
        }
        return result;
    }
    create(createProductDto) {
        this.logger.verbose(`Creating a new product`);
        return this.productRepository.createProduct(createProductDto);
    }
    async update(id, updateProductDto) {
        const { title, image, price, description, status, categoryIds } = updateProductDto;
        const product = await this.fetchById(id);
        if (updateProductDto &&
            Object.keys(updateProductDto).length === 0 &&
            updateProductDto.constructor === Object) {
            throw new common_1.BadRequestException('Make sure correct inputs are provided');
        }
        let categories;
        let ids = null;
        if (categoryIds && categoryIds.length !== 0 && Array.isArray(categoryIds)) {
            ids = categoryIds.map(({ id }) => id);
            categories = await typeorm_2.getRepository(category_entity_1.Category)
                .createQueryBuilder('category')
                .where('category.id IN (:...ids)', {
                ids: ids,
            })
                .getMany();
        }
        product.title = title;
        product.image = image;
        product.price = price;
        product.description = description;
        product.status = status;
        product.categories = categories;
        try {
            await this.productRepository.save(product);
        }
        catch (err) {
            throw new Error('Failed to update the product');
        }
        return product;
    }
    async remove(id) {
        const result = await this.productRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Product with ID "${id}" not found`);
        }
    }
};
ProductService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(product_repository_1.ProductRepository)),
    __metadata("design:paramtypes", [product_repository_1.ProductRepository])
], ProductService);
exports.ProductService = ProductService;
//# sourceMappingURL=product.service.js.map