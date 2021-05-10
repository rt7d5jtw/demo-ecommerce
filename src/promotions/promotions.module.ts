import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromotionsController } from './promotions.controller';
import { PromotionsService } from './promotions.service';
import { PromotionRepository } from './promotions.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PromotionRepository])],
  controllers: [PromotionsController],
  providers: [PromotionsService],
})
export class PromotionsModule {}
