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
exports.CartController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const cart_service_1 = require("./cart.service");
const get_user_decorator_1 = require("../users/get_user.decorator");
const user_entity_1 = require("../users/user.entity");
const common_2 = require("@nestjs/common");
let CartController = class CartController {
    constructor(cartService) {
        this.cartService = cartService;
        this.logger = new common_2.Logger('CartController');
    }
    fetchCart(user) {
        return this.cartService.fetchCart(user);
    }
    fetchCartItems(user) {
        return this.cartService.fetchCartItems(user);
    }
    fetchProductPrice(id) {
        return this.cartService.fetchProductPrice(id);
    }
    createCart(user) {
        return this.cartService.createCart(user);
    }
    addToCart(id, user, qty) {
        return this.cartService.addToCart(id, user, qty);
    }
    removeCartItem(productId, user) {
        return this.cartService.removeCartItem(productId, user);
    }
    clearCart(user) {
        return this.cartService.clearCart(user);
    }
};
__decorate([
    common_1.Get(),
    __param(0, get_user_decorator_1.GetUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "fetchCart", null);
__decorate([
    common_1.Get('/items'),
    __param(0, get_user_decorator_1.GetUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "fetchCartItems", null);
__decorate([
    common_1.Get('/product/:id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "fetchProductPrice", null);
__decorate([
    common_1.Post(),
    common_1.UsePipes(common_1.ValidationPipe),
    __param(0, get_user_decorator_1.GetUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "createCart", null);
__decorate([
    common_1.Post(':id'),
    common_1.UsePipes(common_1.ValidationPipe),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __param(1, get_user_decorator_1.GetUser()),
    __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, user_entity_1.User, Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "addToCart", null);
__decorate([
    common_1.Delete(':productId'),
    __param(0, common_1.Param('productId', common_1.ParseIntPipe)),
    __param(1, get_user_decorator_1.GetUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "removeCartItem", null);
__decorate([
    common_1.Delete(),
    __param(0, get_user_decorator_1.GetUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "clearCart", null);
CartController = __decorate([
    common_1.Controller('cart'),
    common_1.UseGuards(passport_1.AuthGuard('jwt')),
    __metadata("design:paramtypes", [cart_service_1.CartService])
], CartController);
exports.CartController = CartController;
//# sourceMappingURL=cart.controller.js.map