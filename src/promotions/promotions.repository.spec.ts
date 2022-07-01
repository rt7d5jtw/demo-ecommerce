import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promotion } from './promotion.entity';
import { PromotionRepositoryExtended } from './promotions.repository';

const mockPromotionRepository = () => ({
  findOne: jest.fn(),
  delete: jest.fn(),
  createPromotion: jest.fn(),
});

describe('PromotionRepository', () => {
  let promotionRepository: Repository<Promotion> & PromotionRepositoryExtended;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Promotion),
          useFactory: mockPromotionRepository,
        },
      ],
    }).compile();

    promotionRepository = module.get<Repository<Promotion> & PromotionRepositoryExtended>(
      getRepositoryToken(Promotion)
    );
  });

  describe('createPromotion', () => {
    const dto = {
      title: 'i like chocolate',
      url: '/chocolate',
      image: 'https://i.imgur.com/1G1D5Aa.jpeg',
    };

    let save: any;
    beforeEach(() => {
      save = jest.fn();
      promotionRepository.createPromotion = jest.fn().mockReturnValue(Promise.resolve({ save }));
    });

    it('creates a promotion', () => {
      save.mockResolvedValue(undefined);
      expect(promotionRepository.createPromotion(dto)).resolves.not.toThrow();
    });
  });
});
