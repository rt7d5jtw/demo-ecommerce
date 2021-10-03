"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotionRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const promotion_entity_1 = require("./promotion.entity");
let PromotionRepository = class PromotionRepository extends typeorm_1.Repository {
    constructor() {
        super(...arguments);
        this.logger = new common_1.Logger('PromotionRepository');
    }
    async createPromotion(promotionDto) {
        const { title, url, image } = promotionDto;
        const promotion = new promotion_entity_1.Promotion();
        promotion.title = title;
        promotion.url = url;
        promotion.image = image;
        for (const key in promotion) {
            if (promotion[key] === '' || promotion[key] === null || promotion[key] === undefined) {
                throw new common_1.UnprocessableEntityException('Missing values from the promotion');
            }
        }
        try {
            await promotion.save();
        }
        catch (error) {
            this.logger.error(`Failed to create a promotion`, error.stack);
            throw new Error('Promotion could not be saved');
        }
        return promotion;
    }
};
PromotionRepository = __decorate([
    typeorm_1.EntityRepository(promotion_entity_1.Promotion)
], PromotionRepository);
exports.PromotionRepository = PromotionRepository;
//# sourceMappingURL=promotions.repository.js.map