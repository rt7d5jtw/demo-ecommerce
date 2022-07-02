import { Test } from '@nestjs/testing';
import { User } from '../users/user.entity';
import { Order, OrderStatus } from './order.entity';
import { bunchOfOrders } from './orders.controller.spec';
import { OrdersRepositoryExtended } from './orders.repository';
import * as typeorm from 'typeorm';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

const cartItems = [
  {
    id: '97d6fb24-3c64-454c-bec0-113aa5e583a8',
    cartId: '98ae6c5e-b762-4921-b867-dbf297d6200d',
    productId: 28,
    quantity: 1,
    price: 9.5,
    CreatedAt: '2021-07-15',
  },
  {
    id: '49ff2d34-f2a1-4a0a-ae1c-0c2b5065c653',
    cartId: '98ae6c5e-b762-4921-b867-dbf297d6200d',
    productId: 25,
    quantity: 1,
    price: 7,
    CreatedAt: '2021-07-15',
  },
];

describe('OrdersRepository', () => {
  let ordersRepository: Repository<Order> & OrdersRepositoryExtended;

  const mockOrderRepository = () => ({
    createOrder: jest.fn(),
    addOrderItems: jest.fn(),
    fetch: jest.fn(),
    removeOrder: jest.fn(),
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      /* injects the fake connection to typeorm.Connection */
      providers: [
        {
          provide: getRepositoryToken(Order),
          useFactory: mockOrderRepository,
        },
      ],
    }).compile();

    ordersRepository = module.get<Repository<Order> & OrdersRepositoryExtended>(
      getRepositoryToken(Order)
    );
  });

  /*
  const mockUser = new User();
  mockUser.id = 'e6a23d5f-3a23-498f-9f61-ffb9ad34cb68';
  mockUser.email = 'miumau@gmail.com';
  mockUser.password = 'yeetmageet123';

  describe('fetch', () => {
    beforeEach(() => {
      jest.spyOn(typeorm.Repository.prototype, 'createQueryBuilder').mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockReturnValue(bunchOfOrders),
      } as unknown as typeorm.SelectQueryBuilder<any>);
    });
    it('calls createQueryBuilder and returns found orders', async () => {
      const dto = { status: OrderStatus.PROCESSING, search: 'miumau' };
      await expect(ordersRepository.fetch(dto, mockUser)).resolves.toEqual(bunchOfOrders);
      expect(ordersRepository.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('addOrderItems', () => {
    it("adds order's items by calling getManager and getConnection", async () => {
      jest
        .spyOn(ordersRepository, 'addOrderItems')
        .mockImplementation(() => new Promise(() => cartItems));
      expect(
        ordersRepository.addOrderItems('f29ca6ae-3aac-4794-b008-4d743901a226', mockUser)
      ).resolves.toEqual(cartItems);
    });
  });

  describe('createOrder', () => {
    it('creates new instance of Order and sets the attributes and saves it', async () => {
      const dto = {
        total_price: 15,
        address: 'Yeetstreet',
        country: 'Estonia',
        city: 'Parnu',
        postalcode: '01000',
      };

      jest
        .spyOn(ordersRepository, 'createOrder')
        .mockImplementation(() => new Promise(() => cartItems));
      expect(ordersRepository.createOrder(dto, mockUser)).resolves.toEqual({
        total_price: 15,
        address: 'Yeetstreet',
        country: 'Estonia',
        city: 'Parnu',
        postalcode: '01000',
        status: 'PROCESSING',
        userId: mockUser.id,
      });
    });
  });

  describe('removeOrder', () => {
    it('calls ordersRepository.find and uses orderItemRepository.delete to delete items associated with the order along with the order', async () => {
      //jest.spyOn(ordersRepository, 'removeOrder').mockImplementation(() => new Promise(null));

      // Real implementation calls findOne -> delete -> delete
      // 1. ordersRepository.findOne -> finds the Order.
      // 2. orderItemRepository.delete -> delete deletes all orders from OrderItem repository with that orderId.
      // 3. ordersRepository.delete -> deletes the order itself from Order repository.
      jest.spyOn(ordersRepository, 'findOne').mockResolvedValue(bunchOfOrders[0] as Order);

      jest.spyOn(ordersRepository, 'delete').mockResolvedValue({ raw: [], affected: 3 });

      jest.spyOn(ordersRepository, 'find').mockResolvedValue([bunchOfOrders[0]] as Order[]);

      // Test starts here !
      expect(ordersRepository.removeOrder('f29ca6ae-3aac-4794-b008-4d743901a226'));

      // Check that findOne has been called
      expect(ordersRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'f29ca6ae-3aac-4794-b008-4d743901a226' },
      });

      // TODO: Check that deletes have been called!
    });
  });
  */
});
