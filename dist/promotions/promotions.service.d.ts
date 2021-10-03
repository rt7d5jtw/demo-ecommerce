import { PromotionDto } from './dto/promotion.dto';
import { Promotion } from './promotion.entity';
import { PromotionRepository } from './promotions.repository';
export declare class PromotionsService {
    private promotionRepository;
    private logger;
    constructor(promotionRepository: PromotionRepository);
    fetchAll(): Promise<Promotion[] | Promotion>;
    create(promotionDto: PromotionDto): Promise<Promotion>;
    update(id: number, promotionDto: PromotionDto): Promise<Promotion>;
    remove(id: number): Promise<void>;
}
