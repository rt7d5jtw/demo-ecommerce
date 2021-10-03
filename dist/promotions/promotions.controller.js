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
exports.PromotionsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const promotion_dto_1 = require("./dto/promotion.dto");
const promotions_service_1 = require("./promotions.service");
const path_1 = require("path");
const fs_1 = require("fs");
let PromotionsController = class PromotionsController {
    constructor(promotionService) {
        this.promotionService = promotionService;
    }
    fetchAll() {
        return this.promotionService.fetchAll();
    }
    create(promotionDto) {
        return this.promotionService.create(promotionDto);
    }
    async sendStream(res, filename) {
        const file = fs_1.createReadStream(path_1.join(process.cwd(), `./images/${filename['filename']}`));
        file.pipe(res);
    }
    update(id, promotionDto) {
        return this.promotionService.update(id, promotionDto);
    }
    remove(id) {
        return this.promotionService.remove(id);
    }
};
__decorate([
    common_1.Get(),
    common_1.UsePipes(common_1.ValidationPipe),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PromotionsController.prototype, "fetchAll", null);
__decorate([
    common_1.Post(),
    common_1.UseGuards(passport_1.AuthGuard('jwt')),
    common_1.UsePipes(common_1.ValidationPipe),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [promotion_dto_1.PromotionDto]),
    __metadata("design:returntype", Promise)
], PromotionsController.prototype, "create", null);
__decorate([
    common_1.Get('stream'),
    __param(0, common_1.Res()), __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PromotionsController.prototype, "sendStream", null);
__decorate([
    common_1.Patch(':id'),
    common_1.UseGuards(passport_1.AuthGuard('jwt')),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, promotion_dto_1.PromotionDto]),
    __metadata("design:returntype", Promise)
], PromotionsController.prototype, "update", null);
__decorate([
    common_1.Delete(':id'),
    common_1.UseGuards(passport_1.AuthGuard('jwt')),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PromotionsController.prototype, "remove", null);
PromotionsController = __decorate([
    common_1.Controller('promotions'),
    __metadata("design:paramtypes", [promotions_service_1.PromotionsService])
], PromotionsController);
exports.PromotionsController = PromotionsController;
//# sourceMappingURL=promotions.controller.js.map