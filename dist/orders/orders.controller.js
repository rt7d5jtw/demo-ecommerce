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
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const search_orders_dto_1 = require("./dto/search-orders.dto");
const orders_service_1 = require("./orders.service");
const user_entity_1 = require("../users/user.entity");
const get_user_decorator_1 = require("../users/get_user.decorator");
let OrdersController = class OrdersController {
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    fetch(searchOrdersDto, user) {
        return this.ordersService.fetch(searchOrdersDto, user);
    }
    fetchAll() {
        return this.ordersService.fetchAll();
    }
    async addPaymentIntent(paymentDto) {
        return this.ordersService.addPaymentIntent(paymentDto);
    }
    async getInvoice(user, orderId, res) {
        const order = await this.ordersService.fetchById(orderId['orderId'], user);
        const buffer = await this.ordersService.createInvoice(user, order);
        const stream = await this.ordersService.getReadableStream(buffer);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment',
            'Content-Length': buffer.length,
            filename: 'invoice.pdf',
        });
        stream.pipe(res);
    }
    async addOrderItems(id, user) {
        return this.ordersService.addOrderItems(id, user);
    }
    fetchById(id, user) {
        return this.ordersService.fetchById(id, user);
    }
    fetchOrderItems(id) {
        return this.ordersService.fetchOrderItems(id);
    }
    create(createOrderDto, user) {
        return this.ordersService.create(createOrderDto, user);
    }
    update(id, updateOrderDto) {
        return this.ordersService.update(updateOrderDto, id);
    }
    removeOrder(id) {
        return this.ordersService.removeOrder(id);
    }
};
__decorate([
    common_1.Get(),
    __param(0, common_1.Query(common_1.ValidationPipe)),
    __param(1, get_user_decorator_1.GetUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_orders_dto_1.SearchOrdersDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "fetch", null);
__decorate([
    common_1.Get('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "fetchAll", null);
__decorate([
    common_1.Post('create-payment-intent'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "addPaymentIntent", null);
__decorate([
    common_1.Post('/pdf'),
    __param(0, get_user_decorator_1.GetUser()),
    __param(1, common_1.Body()),
    __param(2, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getInvoice", null);
__decorate([
    common_1.Post('items/:id'),
    __param(0, common_1.Param('id')), __param(1, get_user_decorator_1.GetUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "addOrderItems", null);
__decorate([
    common_1.Get(':id'),
    __param(0, common_1.Param('id')), __param(1, get_user_decorator_1.GetUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "fetchById", null);
__decorate([
    common_1.Get('/items/:id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "fetchOrderItems", null);
__decorate([
    common_1.Post(),
    common_1.UsePipes(common_1.ValidationPipe),
    __param(0, common_1.Body()), __param(1, get_user_decorator_1.GetUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "create", null);
__decorate([
    common_1.Patch(':id'),
    common_1.UsePipes(common_1.ValidationPipe),
    __param(0, common_1.Param('id', common_1.ParseUUIDPipe)),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "update", null);
__decorate([
    common_1.Delete(':id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "removeOrder", null);
OrdersController = __decorate([
    common_1.UseGuards(passport_1.AuthGuard('jwt')),
    common_1.Controller('orders'),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], OrdersController);
exports.OrdersController = OrdersController;
//# sourceMappingURL=orders.controller.js.map