import { Test } from '@nestjs/testing';
import { PromotionRepository } from './promotions.repository';

describe('PromotionRepository', () => {
  let promotionRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [PromotionRepository],
    }).compile();
    promotionRepository = module.get<PromotionRepository>(PromotionRepository);
  });

  describe('createPromotion', () => {
    const dto = {
      title: 'i like chocolate',
      url: '/chocolate',
      image: 'https://i.imgur.com/1G1D5Aa.jpeg',
    };

    let save;
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
