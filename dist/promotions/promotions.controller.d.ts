import { PromotionDto } from './dto/promotion.dto';
import { Promotion } from './promotion.entity';
import { PromotionsService } from './promotions.service';
import { Response } from 'express';
export declare class PromotionsController {
    private promotionService;
    constructor(promotionService: PromotionsService);
    fetchAll(): Promise<Promotion[] | Promotion>;
    create(promotionDto: PromotionDto): Promise<Promotion>;
    sendStream(res: Response, filename: {
        filename: string;
    }): Promise<void>;
    update(id: number, promotionDto: PromotionDto): Promise<Promotion>;
    remove(id: number): Promise<void>;
}
