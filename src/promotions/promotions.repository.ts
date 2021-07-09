import { UseGuards, Logger, UnprocessableEntityException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EntityRepository, Repository } from 'typeorm';
import { PromotionDto } from './dto/promotion.dto';
import { Promotion } from './promotion.entity';

@EntityRepository(Promotion)
@UseGuards(AuthGuard())
export class PromotionRepository extends Repository<Promotion> {
  private logger = new Logger('PromotionRepository');

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
  }
}
