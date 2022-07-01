import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PromotionDto } from './dto/promotion.dto';
import { Promotion } from './promotion.entity';
import { PromotionRepository, PromotionRepositoryExtended } from './promotions.repository';

@Injectable()
export class PromotionsService {
  constructor(
    @InjectRepository(Promotion)
    private promotionRepository: Repository<Promotion> & PromotionRepositoryExtended
  ) {}

  async fetchAll(): Promise<Promotion[] | Promotion> {
    return await this.promotionRepository.find();
  }

  async create(promotionDto: PromotionDto): Promise<Promotion> {
    return PromotionRepository.createPromotion(promotionDto);
  }

  async update(id: number, promotionDto: PromotionDto): Promise<Promotion> {
    const { title, url, image } = promotionDto;
    const promotion = await this.promotionRepository.findOne({ where: { id: id } });
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
