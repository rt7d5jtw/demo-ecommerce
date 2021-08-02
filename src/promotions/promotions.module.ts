import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromotionsController } from './promotions.controller';
import { PromotionsService } from './promotions.service';
import { PromotionRepository } from './promotions.repository';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([PromotionRepository]), PassportModule, AuthModule],
  controllers: [PromotionsController],
  providers: [PromotionsService],
})
export class PromotionsModule {}
