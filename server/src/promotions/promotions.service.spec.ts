import { Test } from '@nestjs/testing';
import { PromotionsService } from './promotions.service';
import { Repository } from 'typeorm';
import { Promotion } from './promotion.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { bunchOfPromotions } from '../../test/testdata.json';
import { UnprocessableEntityException } from '@nestjs/common';

const mockPromotionsRepository = () => ({
  find: jest.fn(() => Promise.resolve(bunchOfPromotions)),
  findOne: jest.fn((id) => {
    return {
      id,
      title: 'test',
      url: '/testing',
      image: 'https://i.imgur.com/something.png'
    };
  }),
  create: jest.fn(() => new Promotion()),
  delete: jest.fn(),
  createPromotion: jest.fn((dto) => {
    dto['id'] = Math.floor(Math.random() * 100) + 1;
    return Promise.resolve(dto);
  }),
  update: jest.fn((id, dto) => {
    dto['id'] = id;
    return Promise.resolve(dto);
  }),
  remove: jest.fn(() => Promise.resolve()),
  save: jest.fn()
});

describe('PromotionsService', () => {
  let promotionService: PromotionsService;
  let promotionRepository: Repository<Promotion>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PromotionsService,
        {
          provide: getRepositoryToken(Promotion),
          useFactory: mockPromotionsRepository
        }
      ]
    }).compile();

    promotionService = module.get<PromotionsService>(PromotionsService);
    promotionRepository = module.get<Repository<Promotion>>(
      getRepositoryToken(Promotion)
    );
  });

  jest.mock('fs');

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchAll', () => {
    it('calls find() method from userRepository and returns promotion(s)', async () => {
      expect.assertions(2);
      expect(await promotionService.fetchAll()).toEqual([
        {
          id: expect.any(Number),
          title: expect.any(String),
          url: expect.any(String),
          image: expect.any(String)
        },
        {
          id: expect.any(Number),
          title: expect.any(String),
          url: expect.any(String),
          image: expect.any(String)
        },
        {
          id: expect.any(Number),
          title: expect.any(String),
          url: expect.any(String),
          image: expect.any(String)
        }
      ]);
      expect(promotionRepository.find).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    const dto = {
      title: 'i like chocolate',
      url: '/chocolate',
      image: 'https://i.imgur.com/1G1D5Aa.jpeg'
    };

    it('Creates a promotion by calling promotionRepository.create, assinging values to fields and validating inputs and finally calling promotionRepository.save and returning the promotion', async () => {
      const result = await promotionService.create(dto);
      expect(result).not.toThrow;
      expect(result).toEqual(dto);
      expect(result).toBeInstanceOf(Promotion);
      expect(promotionRepository.create).toHaveBeenCalled();
      expect(promotionRepository.save).toHaveBeenCalled();
    });
    it('Tries to create a promotions with invalid inputs, should fail', async () => {
      expect(
        promotionService.create({ title: '', url: '', image: '' })
      ).rejects.toThrow(UnprocessableEntityException);
      expect(
        promotionService.create({
          title: 'something',
          url: 'almost',
          image: ''
        })
      ).rejects.toThrow(UnprocessableEntityException);
    });
  });

  describe('update', () => {
    it('calls repo with findOne and assigns new properties and calls save', async () => {
      // To make sure promotionRepository.findOne returns a promotion
      jest
        .spyOn(promotionRepository, 'findOne')
        .mockResolvedValue(bunchOfPromotions[0] as unknown as Promotion);

      const dto = {
        title: 'test',
        url: '/testing',
        image: './images/hazelnut'
      };

      expect(await promotionService.update(17, dto)).toEqual({
        id: expect.any(Number),
        ...dto
      });

      expect(promotionRepository.findOne).toHaveBeenCalled();
      expect(promotionRepository.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('calls findOne and delete to remove the user', async () => {
      jest
        .spyOn(promotionRepository, 'delete')
        .mockResolvedValue({ affected: 1, raw: '' });
      expect(await promotionService.remove(17)).toBeUndefined();
      expect(promotionRepository.delete).toHaveBeenCalled();
    });
  });
});
