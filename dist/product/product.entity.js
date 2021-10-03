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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = exports.ProductStatus = void 0;
const typeorm_1 = require("typeorm");
const cart_item_entity_1 = require("../cart/cart-item.entity");
const order_item_entity_1 = require("../orders/order-item.entity");
const category_entity_1 = require("../category/category.entity");
var ProductStatus;
(function (ProductStatus) {
    ProductStatus["IN_STOCK"] = "IN_STOCK";
    ProductStatus["OUT_OF_STOCK"] = "OUT_OF_STOCK";
})(ProductStatus = exports.ProductStatus || (exports.ProductStatus = {}));
let Product = class Product extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Product.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Product.prototype, "title", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Product.prototype, "image", void 0);
__decorate([
    typeorm_1.Column('float'),
    __metadata("design:type", Number)
], Product.prototype, "price", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Product.prototype, "status", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ type: 'date' }),
    __metadata("design:type", Date)
], Product.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ type: 'date' }),
    __metadata("design:type", Date)
], Product.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.OneToMany(() => cart_item_entity_1.CartItem, (cartitem) => cartitem.product),
    __metadata("design:type", Array)
], Product.prototype, "cartItem", void 0);
__decorate([
    typeorm_1.OneToMany(() => order_item_entity_1.OrderItem, (orderitem) => orderitem.product),
    __metadata("design:type", Array)
], Product.prototype, "orderItem", void 0);
__decorate([
    typeorm_1.ManyToMany(() => category_entity_1.Category, {
        cascade: true,
    }),
    typeorm_1.JoinTable({
        name: 'product_categories',
        joinColumn: {
            name: 'productId',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'categoryId',
            referencedColumnName: 'id',
        },
    }),
    __metadata("design:type", Array)
], Product.prototype, "categories", void 0);
Product = __decorate([
    typeorm_1.Entity('products')
], Product);
exports.Product = Product;
//# sourceMappingURL=product.entity.js.map