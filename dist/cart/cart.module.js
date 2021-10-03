"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cart_controller_1 = require("./cart.controller");
const cart_service_1 = require("./cart.service");
const cart_repository_1 = require("./cart.repository");
const auth_module_1 = require("../auth/auth.module");
const product_repository_1 = require("../product/product.repository");
const platform_express_1 = require("@nestjs/platform-express");
const passport_1 = require("@nestjs/passport");
let CartModule = class CartModule {
};
CartModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([cart_repository_1.CartRepository, product_repository_1.ProductRepository]),
            platform_express_1.MulterModule.register({
                dest: './images',
            }),
            passport_1.PassportModule,
            auth_module_1.AuthModule,
        ],
        controllers: [cart_controller_1.CartController],
        providers: [cart_service_1.CartService],
    })
], CartModule);
exports.CartModule = CartModule;
//# sourceMappingURL=cart.module.js.map