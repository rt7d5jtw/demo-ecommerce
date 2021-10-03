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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const cart_item_entity_1 = require("./cart-item.entity");
const cart_repository_1 = require("./cart.repository");
const typeorm_1 = require("@nestjs/typeorm");
const product_entity_1 = require("../product/product.entity");
const typeorm_2 = require("typeorm");
let CartService = class CartService {
    constructor(cartRepository) {
        this.cartRepository = cartRepository;
    }
    async fetchCart(user) {
        return this.cartRepository.findOne({
            where: { userId: user['id'] },
        });
    }
    async fetchItems(user) {
        const cart = await this.fetchCart(user);
        const cartItem = await typeorm_2.getRepository(cart_item_entity_1.CartItem)
            .createQueryBuilder('cartItem')
            .select('cartItem')
            .where('cartItem.cartId = :cartId', { cartId: cart.id })
            .getMany();
        return cartItem;
    }
    async fetchCartItems(user) {
        const userId = user['id'];
        const cart = await this.cartRepository.findOne({
            where: { userId: userId },
        });
        if (!cart) {
            throw new common_1.NotFoundException('User has no cart');
        }
        const cartItems = await typeorm_2.getManager().query(`
      SELECT ct."productId", prods."title", 
      prods."image", prods."price", ct."quantity" FROM "cart-item" as ct
      JOIN "products" as prods
        ON prods."id" = ct."productId"
      WHERE ct."cartId" = '${cart.id}';
      `);
        return cartItems;
    }
    async fetchProductPrice(id) {
        const price = await typeorm_2.getRepository(product_entity_1.Product).findOne(id);
        if (!price) {
            throw new common_1.NotFoundException(`Price with ID "${id}" not found`);
        }
        return price.price;
    }
    async createCart(user) {
        return this.cartRepository.createCart(user);
    }
    async addToCart(id, user, qty) {
        const { quantity } = qty;
        if (!quantity) {
            throw new common_1.NotFoundException('Quantity is missing');
        }
        const cart = await this.fetchCart(user);
        if (!cart) {
            throw new common_1.NotFoundException('User has no cart');
        }
        const price = await this.fetchProductPrice(id);
        if (!price) {
            throw new common_1.NotFoundException('Price could not be found');
        }
        const cartItem = new cart_item_entity_1.CartItem();
        cartItem.cartId = cart.id;
        cartItem.quantity = quantity;
        cartItem.price = price * quantity;
        cartItem.productId = id;
        const cartItems = await this.fetchItems(user);
        for (let i = 0; i < cartItems.length; i++) {
            if (cartItems[i].cartId === cartItem.cartId &&
                cartItems[i].productId === cartItem.productId) {
                const cart_copy = cartItems[i].productId;
                cartItem.quantity = cartItems[i].quantity + cartItem.quantity;
                cartItem.price = cartItems[i].price + cartItem.price;
                this.removeCartItem(cart_copy, user);
            }
        }
        return cartItem.save();
    }
    async removeCartItem(productId, user) {
        const userId = user['id'];
        const { id } = await this.cartRepository.findOne({
            where: { userId: userId },
        });
        const cartItem = await typeorm_2.getRepository(cart_item_entity_1.CartItem)
            .createQueryBuilder('cartItem')
            .where('cartItem.cartId = :cartId', { cartId: id })
            .andWhere('cartItem.productId = :productId', { productId: productId })
            .getOne();
        if (!cartItem) {
            throw new common_1.NotFoundException(`Cart Item was not found`);
        }
        if (id === cartItem.cartId) {
            const result = await typeorm_2.getRepository(cart_item_entity_1.CartItem).delete(await cartItem.id);
            if (result.affected === 0) {
                throw new common_1.NotFoundException("Item is not in user's cart or item does not exist");
            }
        }
    }
    async clearCart(user) {
        const userId = user['id'];
        const { id } = await this.cartRepository.findOne({
            where: { userId: userId },
        });
        if (!id) {
            throw new common_1.NotFoundException('No cart found');
        }
        return typeorm_2.getRepository(cart_item_entity_1.CartItem).delete({ cartId: id });
    }
};
CartService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(cart_repository_1.CartRepository)),
    __metadata("design:paramtypes", [cart_repository_1.CartRepository])
], CartService);
exports.CartService = CartService;
//# sourceMappingURL=cart.service.js.map