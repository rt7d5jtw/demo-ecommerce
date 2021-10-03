"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const orders_repository_1 = require("./orders.repository");
const order_item_entity_1 = require("./order-item.entity");
const typeorm_2 = require("typeorm");
const stream_1 = require("stream");
const stripe_1 = require("stripe");
const product_entity_1 = require("../product/product.entity");
let OrdersService = class OrdersService {
    constructor(ordersRepository) {
        this.ordersRepository = ordersRepository;
    }
    async fetch(searchOrdersDto, user) {
        return this.ordersRepository.fetch(searchOrdersDto, user);
    }
    async fetchById(id, user) {
        const result = await this.ordersRepository.findOne({ where: { id, userId: user.id } });
        if (!result) {
            throw new common_1.NotFoundException(`Order with ID "${id}" not found`);
        }
        return result;
    }
    async fetchAll() {
        return this.ordersRepository.query('SELECT * FROM public.orders');
    }
    async fetchOrderItems(id) {
        const orderItems = await typeorm_2.getRepository(order_item_entity_1.OrderItem)
            .createQueryBuilder('orderItem')
            .innerJoin(product_entity_1.Product, 'product', 'product.id = orderItem.productId')
            .select([
            'product.id',
            'orderItem.orderId',
            'orderItem.quantity',
            'orderItem.price',
            'product.title',
            'product.image',
        ])
            .where('orderItem.orderId = :orderId', { orderId: id })
            .getRawMany();
        for (let i = 0; i < orderItems.length; i++) {
            for (const key in orderItems[i]) {
                RegExp('(orderItem_)').test(key)
                    ? delete Object.assign(orderItems[i], {
                        [`${key.replace(/orderItem_/, '')}`]: orderItems[i][key],
                    })[key]
                    : key === 'product_id'
                        ? ((orderItems[i]['productId'] = orderItems[i][key]), delete orderItems[i][key])
                        : RegExp('(product_)(?!id)').test(key)
                            ? delete Object.assign(orderItems[i], {
                                [`${key.replace(/product_/, '')}`]: orderItems[i][key],
                            })[key]
                            : null;
            }
        }
        return orderItems;
    }
    async addPaymentIntent(paymentDto) {
        const stripe = new stripe_1.default(process.env.STRIPE_SECRET, { apiVersion: '2020-08-27' });
        const { amount, currency, payment_method_types, metadata } = paymentDto;
        const params = {
            amount: amount * 100,
            currency,
            payment_method_types: [payment_method_types],
            metadata,
        };
        const paymentIntent = await stripe.paymentIntents.create(params);
        return paymentIntent;
    }
    async createInvoice(user, order) {
        return this.ordersRepository.createInvoice(user, order);
    }
    async create(createOrderDto, user) {
        return this.ordersRepository.createOrder(createOrderDto, user);
    }
    async getReadableStream(buffer) {
        const stream = new stream_1.Readable();
        stream.push(buffer);
        stream.push(null);
        return stream;
    }
    async update(updateOrderDto, id) {
        const order = await this.ordersRepository.findOne(id);
        const { total_price, address, country, city, postalcode, status } = updateOrderDto;
        order.total_price = total_price;
        order.address = address;
        order.country = country;
        order.city = city;
        order.postalcode = postalcode;
        order.status = status;
        try {
            await order.save();
        }
        catch (_a) {
            throw new Error('Order could not be saved');
        }
        return order;
    }
    async removeOrder(id) {
        const order = await this.ordersRepository.findOne({
            where: { id: id },
        });
        typeorm_2.getRepository(order_item_entity_1.OrderItem).delete({ orderId: order.id });
        const result = await this.ordersRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Order with ID "${id}" not found`);
        }
    }
    async addOrderItems(id, user) {
        return this.ordersRepository.addOrderItems(id, user);
    }
};
OrdersService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(orders_repository_1.OrdersRepository)),
    __metadata("design:paramtypes", [orders_repository_1.OrdersRepository])
], OrdersService);
exports.OrdersService = OrdersService;
//# sourceMappingURL=orders.service.js.map