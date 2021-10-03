import { Repository } from 'typeorm';
import { PromotionDto } from './dto/promotion.dto';
import { Promotion } from './promotion.entity';
export declare class PromotionRepository extends Repository<Promotion> {
    private logger;
    createPromotion(promotionDto: PromotionDto): Promise<Promotion>;
}
