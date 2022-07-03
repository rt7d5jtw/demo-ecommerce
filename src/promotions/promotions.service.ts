import {
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TypeORMError } from 'typeorm';
import { PromotionDto } from './dto/promotion.dto';
import { Promotion } from './promotion.entity';

@Injectable()
export class PromotionsService {
  private logger = new Logger('PromotionsService');
  constructor(
    @InjectRepository(Promotion)
    private promotionRepository: Repository<Promotion>
  ) {}

  /**
   * Calls promotionRepository.find to return all promotions.
   * @returns {Promotion[]}
   */
  async fetchAll(): Promise<Promotion[] | Promotion> {
    return await this.promotionRepository.find();
  }

  /**
   * Creates a new Promotion from the PromotionDto inputs and returns it.
   * @param {PromotionDto} promotionDto -  image: {string}, title {string}, url {string}
   * @returns {Promise<Promotion>} new promotion created from the inputs
   */
  async create(promotionDto: PromotionDto): Promise<Promotion> {
    const { title, url, image } = promotionDto;
    const promotion = this.promotionRepository.create();

    promotion.title = title;
    promotion.url = url;
    promotion.image = image;

    for (const key in promotion) {
      if (
        promotion[key] === '' ||
        promotion[key] === null ||
        promotion[key] === undefined
      ) {
        throw new UnprocessableEntityException(
          'Missing values from the promotion'
        );
      }
    }

    try {
      await this.promotionRepository.save(promotion);
    } catch (error) {
      this.logger.error(`Failed to create a promotion`, error.stack);
      throw new TypeORMError('Promotion could not be saved');
    }

    return promotion;
  }

  /**
   * Searches for the Promotion, if found updates and saves the fields to the new values and returns the Promotion.
   * @param {number} id - ID of the Promotion to be updated with the PromotionDto inputs.
   * @param {PromotionDto} promotionDto - Inputs to be assigned for the {@link Promotion}.
   * @returns {Promise<Promotion>} Promise that was updated.
   */
  async update(id: number, promotionDto: PromotionDto): Promise<Promotion> {
    const { title, url, image } = promotionDto;
    const promotion = await this.promotionRepository.findOne({
      where: { id: id }
    });

    if (!promotion) {
      throw new NotFoundException(`Promotion with ID "${id}" not found`);
    }

    promotion.title = title;
    promotion.image = image;
    promotion.url = url;
    await this.promotionRepository.save(promotion);

    return promotion;
  }

  /**
   * Removes the promotion by calling {@link PromotionRepository.delete}.
   * @param {number} id - ID of the {@link Promotion} to be removed.
   * @returns {Promise<void>}
   */
  async remove(id: number): Promise<void> {
    const result = await this.promotionRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Promotion with ID "${id}" not found`);
    }
  }
}
