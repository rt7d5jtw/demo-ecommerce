import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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

  async fetchAll(): Promise<Promotion[] | Promotion> {
    return await this.promotionRepository.find();
  }

  async create(promotionDto: PromotionDto): Promise<Promotion> {
    return this.promotionRepository.createa(promotionDto);
  }

  async update(id: number, promotionDto: PromotionDto): Promise<Promotion> {
    const { title, url, image } = promotionDto;
    const promotion = await this.promotionRepository.findOne(id);
    if (!promotion) {
      throw new NotFoundException(`Promotion with ID "${id}" not found`);
    }

    promotion.title = title;
    promotion.image = image;
    promotion.url = url;
    await promotion.save();

    return promotion;
  }

  async remove(id: number): Promise<void> {
    const result = await this.promotionRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Promotion with ID "${id}" not found`);
    }
  }
}
