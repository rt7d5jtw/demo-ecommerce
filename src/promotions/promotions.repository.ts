import { UseGuards, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EntityRepository, Repository } from 'typeorm';
import { PromotionDto } from './dto/promotion.dto';
import { Promotion } from './promotion.entity';

@EntityRepository(Promotion)
@UseGuards(AuthGuard())
export class PromotionRepository extends Repository<Promotion> {
  private logger = new Logger('PromotionRepository');

  async createa(promotionDto: PromotionDto): Promise<Promotion> {
    const { title, url, image } = promotionDto;
    const promotion = new Promotion();
    promotion.title = title;
    promotion.url = url;
    promotion.image = image;

    try {
      await promotion.save();
    } catch (error) {
      this.logger.error(`Failed to create a promotion`, error.stack);
    }

    return promotion;
  }
}
