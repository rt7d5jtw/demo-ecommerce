"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersRepository = void 0;
const order_entity_1 = require("./order.entity");
const typeorm_1 = require("typeorm");
const invoice_1 = require("./invoice");
const order_item_entity_1 = require("./order-item.entity");
const PDFDocument = require("pdfkit");
const common_1 = require("@nestjs/common");
let OrdersRepository = class OrdersRepository extends typeorm_1.Repository {
    async fetch(searchOrdersDto, user) {
        const { status, search } = searchOrdersDto;
        const query = this.createQueryBuilder('order');
        query.where('order.userId = :userId', { userId: user.id });
        if (status) {
            query.andWhere('order.status = :status', { status });
        }
        if (search) {
            query.andWhere('order.userId LIKE :search OR order.totalprice LIKE :search OR order.address LIKE :search', { search: `%${search}%` });
        }
        const orders = await query.getMany();
        return orders;
    }
    async createInvoice(user, order) {
        const manager = typeorm_1.getManager();
        const orderItems = await manager.query(`
    SELECT "products"."title" AS "item", "products"."id" as "productId", "order-item"."quantity", "products"."price" AS "amount"
    FROM "orders"
    INNER JOIN "order-item" 
      ON "order-item"."orderId" = "orders"."id"
    INNER JOIN "products"
      ON "products"."id" = "order-item"."productId"
      WHERE "order-item"."orderId" = '${order.id}'
      AND "orders"."userId" = '${user['id']}'
      `);
        const invoice = {
            shipping: {
                email: user.email,
                address: order.address,
                city: order.city,
                country: order.country,
                postal_code: order.postalcode,
            },
            items: orderItems,
            subtotal: order.total_price,
            delivery: 5,
            invoice_nr: order.id,
        };
        const pdfBuffer = await new Promise((resolve) => {
            const doc = new PDFDocument({
                size: 'A4',
                margin: 50,
                bufferPages: true,
            });
            invoice_1.generateInvoiceInformation(doc, invoice);
            invoice_1.generateInvoiceTable(doc, invoice);
            doc.end();
            const buffer = [];
            doc.on('data', buffer.push.bind(buffer));
            doc.on('end', () => {
                const data = Buffer.concat(buffer);
                resolve(data);
            });
        });
        return pdfBuffer;
    }
    async createOrder(createOrderDto, user) {
        const { total_price, address, country, city, postalcode } = createOrderDto;
        const order = new order_entity_1.Order();
        order.total_price = total_price;
        order.address = address;
        order.country = country;
        order.city = city;
        order.postalcode = postalcode.toString();
        order.status = order_entity_1.OrderStatus.PROCESSING;
        order.userId = user.id;
        for (const key in order) {
            if (order[key] === '' || order[key] === null || order[key] === undefined) {
                throw new common_1.UnprocessableEntityException('Missing values from the order');
            }
        }
        try {
            await order.save();
        }
        catch (err) {
            throw new Error(`Order could not be saved`);
        }
        await this.addOrderItems(order.id, user);
        return order;
    }
    async addOrderItems(id, user) {
        const userId = user['id'];
        const cartItems = await typeorm_1.getManager().query(`
    SELECT ct."id", ct."price", ct."quantity", ct."productId" FROM "cart"
    JOIN "cart-item" as ct
      ON "cart"."id" = ct."cartId"
      WHERE "cart"."userId" = '${userId}'
      `);
        const orders = [];
        for (let i = 0; i < cartItems.length; i++) {
            const order = {
                orderId: null,
                price: null,
                quantity: null,
                product: null,
            };
            order.orderId = id;
            order.price = cartItems[i].price;
            order.quantity = cartItems[i].quantity;
            order.product = cartItems[i].productId;
            orders.push(order);
        }
        await typeorm_1.getConnection().createQueryBuilder().insert().into(order_item_entity_1.OrderItem).values(orders).execute();
        return cartItems;
    }
};
OrdersRepository = __decorate([
    typeorm_1.EntityRepository(order_entity_1.Order)
], OrdersRepository);
exports.OrdersRepository = OrdersRepository;
//# sourceMappingURL=orders.repository.js.map