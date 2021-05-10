import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PromotionDto } from './dto/promotion.dto';
import { Promotion } from './promotion.entity';
import { PromotionsService } from './promotions.service';

@Controller('promotions')
export class PromotionsController {
  constructor(private promotionService: PromotionsService) {}

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() promotionDto: PromotionDto): Promise<Promotion> {
    return this.promotionService.create(promotionDto);
  }
}
