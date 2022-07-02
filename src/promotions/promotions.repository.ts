import { UnprocessableEntityException } from '@nestjs/common';
import { SearchOrdersDto } from '../orders/dto/search-orders.dto';
import { Order } from '../orders/order.entity';
import { AppDataSource } from '../config/typeorm.config';
import { PromotionDto } from './dto/promotion.dto';
import { Promotion } from './promotion.entity';

interface PromotionRepositoryExtended {
  createPromotion: (arg0: PromotionDto) => Promise<Promotion>;
}

const PromotionRepository = AppDataSource.getRepository(Promotion).extend({
  async createPromotion(promotionDto: PromotionDto): Promise<Promotion> {
    const { title, url, image } = promotionDto;
    const promotion = new Promotion();
    promotion.title = title;
    promotion.url = url;
    promotion.image = image;

    for (const key in promotion) {
      if (promotion[key] === '' || promotion[key] === null || promotion[key] === undefined) {
        throw new UnprocessableEntityException('Missing values from the promotion');
      }
    }

    try {
      await promotion.save();
    } catch (error) {
      this.logger.error(`Failed to create a promotion`, error.stack);
      throw new Error('Promotion could not be saved');
    }

    return promotion;
  },
});

export { PromotionRepository, PromotionRepositoryExtended };
