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
exports.CartItem = void 0;
const typeorm_1 = require("typeorm");
const cart_entity_1 = require("./cart.entity");
const product_entity_1 = require("../product/product.entity");
let CartItem = class CartItem extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", Object)
], CartItem.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: 'uuid' }),
    __metadata("design:type", String)
], CartItem.prototype, "cartId", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], CartItem.prototype, "productId", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], CartItem.prototype, "quantity", void 0);
__decorate([
    typeorm_1.Column('float'),
    __metadata("design:type", Number)
], CartItem.prototype, "price", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ type: 'date' }),
    __metadata("design:type", Date)
], CartItem.prototype, "CreatedAt", void 0);
__decorate([
    typeorm_1.ManyToOne(() => cart_entity_1.Cart, (cart) => cart.cartItems, {
        onDelete: 'CASCADE',
    }),
    typeorm_1.JoinColumn([{ name: 'cartId', referencedColumnName: 'id' }]),
    __metadata("design:type", cart_entity_1.Cart)
], CartItem.prototype, "cart", void 0);
__decorate([
    typeorm_1.ManyToOne(() => product_entity_1.Product, (product) => product.cartItem),
    __metadata("design:type", Array)
], CartItem.prototype, "product", void 0);
CartItem = __decorate([
    typeorm_1.Entity('cart-item')
], CartItem);
exports.CartItem = CartItem;
//# sourceMappingURL=cart-item.entity.js.map