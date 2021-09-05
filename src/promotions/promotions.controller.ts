import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PromotionDto } from './dto/promotion.dto';
import { Promotion } from './promotion.entity';
import { PromotionsService } from './promotions.service';
import { join } from 'path';
import { createReadStream } from 'fs';
import { Response } from 'express';

@Controller('promotions')
export class PromotionsController {
  constructor(private promotionService: PromotionsService) {}

  @Get()
  @UsePipes(ValidationPipe)
  fetchAll(): Promise<Promotion[] | Promotion> {
    return this.promotionService.fetchAll();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(ValidationPipe)
  create(@Body() promotionDto: PromotionDto): Promise<Promotion> {
    return this.promotionService.create(promotionDto);
  }

  @Get('stream')
  async sendStream(@Res() res: Response, @Query() filename: { filename: string }) {
    const file = createReadStream(join(process.cwd(), `./images/${filename['filename']}`));
    file.pipe(res);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() promotionDto: PromotionDto
  ): Promise<Promotion> {
    return this.promotionService.update(id, promotionDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.promotionService.remove(id);
  }
}
