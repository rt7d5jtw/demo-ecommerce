import { Test } from '@nestjs/testing';
import { PromotionsController } from './promotions.controller';
import { PromotionsService } from './promotions.service';
import * as fs from 'fs';
import { mockResponse, mockRequest } from 'jest-mock-req-res';
import { join } from 'path';

export const bunchOfPromotions = [
  {
    id: 1,
    title: 'test',
    url: '/testing',
    image: 'https://i.imgur.com/ZgD7uRS.png',
  },
  {
    id: 2,
    title: 'test2',
    url: '/testingg',
    image: 'https://i.imgur.com/mIxAqbE.png',
  },
  {
    id: 3,
    title: 'test3',
    url: '/testinggg',
    image: 'https://i.imgur.com/94SQCwE.png',
  },
];

const mockPromotionsService = () => ({
  fetchAll: jest.fn(() => Promise.resolve(bunchOfPromotions)),
  create: jest.fn((dto) => {
    dto['id'] = 17;
    return Promise.resolve(dto);
  }),
  update: jest.fn((id, dto) => {
    dto['id'] = id;
    return Promise.resolve(dto);
  }),
  remove: jest.fn(() => Promise.resolve()),
});

describe('PromotionsController', () => {
  let promotionsController: PromotionsController;
  let promotionsService: PromotionsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [PromotionsController],
      providers: [
        {
          provide: PromotionsService,
          useFactory: mockPromotionsService,
        },
      ],
    }).compile();

    promotionsController = module.get<PromotionsController>(PromotionsController);
    promotionsService = module.get<PromotionsService>(PromotionsService);
  });

  jest.mock('fs');

  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('fetchAll', () => {
    it('returns all promotions', async () => {
      expect(await promotionsController.fetchAll()).toEqual([
        {
          id: expect.any(Number),
          title: expect.any(String),
          url: expect.any(String),
          image: expect.any(String),
        },
        {
          id: expect.any(Number),
          title: expect.any(String),
          url: expect.any(String),
          image: expect.any(String),
        },
        {
          id: expect.any(Number),
          title: expect.any(String),
          url: expect.any(String),
          image: expect.any(String),
        },
      ]);
    });
  });

  describe('create', () => {
    it('creates a new promotion and returns it', async () => {
      const dto = { title: 'test', url: '/testing', image: 'chocolate.png' };
      expect(await promotionsController.create(dto)).toEqual({
        id: expect.any(Number),
        title: 'test',
        url: '/testing',
        image: 'chocolate.png',
      });
    });
  });

  describe('sendStream', () => {
    it('sends a file as a stream', async () => {
      jest.spyOn(fs, 'createReadStream').mockImplementation(() => {
        const original = jest.requireActual('fs');
        return {
          ...original,
          pipe: jest.fn().mockResolvedValue('yeet'),
        };
      });
      const req = mockRequest();
      req.res = mockResponse();
      const query = { filename: 'example.png' };
      expect(await promotionsController.sendStream(req.res, query)).toBeUndefined();
      expect(fs.createReadStream).toHaveBeenCalledWith(join(process.cwd(), `./images/example.png`));
    });
  });

  describe('update', () => {
    it('updates an existing promotion and returns it', async () => {
      const dto = {
        title: 'i like chocolate',
        url: '/chocolate',
        image: 'chocolate.png',
      };
      expect(await promotionsController.update(17, dto)).toEqual({
        id: expect.any(Number),
        title: expect.any(String),
        url: expect.any(String),
        image: expect.any(String),
      });
    });
  });

  describe('remove', () => {
    it('removes the promotion by calling promotionsService', async () => {
      expect.assertions(2);
      expect(await promotionsController.remove(17)).toBeUndefined();
      expect(promotionsService.remove).toHaveBeenCalledWith(17);
    });
  });
});
