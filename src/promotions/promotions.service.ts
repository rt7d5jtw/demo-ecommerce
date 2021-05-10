import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PromotionDto } from './dto/promotion.dto';
import { Promotion } from './promotion.entity';
import { PromotionRepository } from './promotions.repository';

@Injectable()
export class PromotionsService {
  private logger = new Logger('PromotionRepository');
  constructor(
    @InjectRepository(PromotionRepository)
    private promotionRepository: PromotionRepository,
  ) {}

  async create(promotionDto: PromotionDto): Promise<Promotion> {
    return this.promotionRepository.createa(promotionDto);
  }
}
