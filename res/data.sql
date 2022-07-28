-- Postgres schema

-- PostgreSQL allows you store and compare UUID values 
-- but it does not include functions for generating the UUID values in its core.
-- uuid-ossp module provides algorithms for generating UUIDs.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; -- UUID generation support

-- Tables
CREATE TABLE users (
    id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    email VARCHAR(254) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(10) NOT NULL,
    salt VARCHAR(64) NOT NULL,
    registered_at timestamp NOT NULL,
    unique(email)
);

CREATE TABLE products (
    id SERIAL NOT NULL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image VARCHAR(255) NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    description VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
    createdat timestamp NOT NULL,
    updatedat timestamp NOT NULL
);

CREATE TABLE cart (
    id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    user_id uuid REFERENCES users (id),
    createdAt timestamp NOT NULL
);

CREATE TABLE cart_item (
    id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    cart_id uuid REFERENCES cart (id),
    product_id SERIAL REFERENCES products (id),
    quantity INTEGER NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    createdAt timestamp NOT NULL
);

CREATE TABLE category (
    id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    cname VARCHAR(255) NOT NULL
);

CREATE TABLE orders (
    id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    user_id uuid REFERENCES users (id),
    address VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    country VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    total_price DOUBLE PRECISION NOT NULL,
    postalcode VARCHAR(255) NOT NULL
);

CREATE TABLE order_item (
    id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    order_id uuid REFERENCES orders (id),
    quantity INTEGER NOT NULL,
    productId INTEGER,
    price DOUBLE PRECISION NOT NULL
);

CREATE TABLE product_categories (
    product_id INTEGER REFERENCES products (id),
    category_id uuid REFERENCES category (id)
);

CREATE TABLE promotions (
    id SERIAL NOT NULL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL,
    image VARCHAR(255) NOT NULL
);

-- Table aliases 
-- Backwards compatibility for older queries

-- Changed from "cart-item" to cart_item
-- cart_item AS "cart-item"; 
-- Changed from "order-item" to order_item
-- order_item AS "order-item";

-- Owner of the Tables
-- ALTER TABLE public.cart OWNER TO postgres;
-- ALTER TABLE public."cart-item" OWNER TO postgres;
-- ALTER TABLE public.category OWNER TO postgres;
-- ALTER TABLE public."order-item" OWNER TO postgres;
-- ALTER TABLE public.orders OWNER TO postgres;
-- ALTER TABLE public.product_categories OWNER TO postgres;
-- ALTER TABLE public.products OWNER TO postgres;
-- ALTER TABLE public.promotions OWNER TO postgres;
-- ALTER TABLE public.users OWNER TO postgres;

-- Insertations

INSERT INTO users (id, email, password, role, salt, registered_at)
VALUES
  ('ad64e856-3e74-4ddf-ad84-ce404483a3a3',	'testing@user.com',	'$2b$10$xJcCBRZVJTVZX93Dw7BUsu2WpuwuaTH5iL7aWNOPKUhIfRuAGbR4i',	'GUEST',	'$2b$10$xJcCBRZVJTVZX93Dw7BUsu',	'2021-10-03'),
  ('700e9b50-9bb9-42e0-bf6d-83ae38267649',	'meemau@gmail.com',	'$2b$10$vQVlcMFTN5xVeg2ElZIFnuDDyt44OAOMUIf3Iv0Ly8iNdfT60CiZu',	'ADMIN',	'$2b$10$vQVlcMFTN5xVeg2ElZIFnu',	'2021-06-30'),
  ('1d78343f-82e1-4af7-bcea-77b9d87f3538',	'miumau@gmail.com',	'$2b$10$SyzY0wCknTEmvlvKqjP7x.uplLjt42YEXIYhpo0AClLfU0VqGgWh.',	'USER', '$2b$10$SyzY0wCknTEmvlvKqjP7x.',	'2021-06-17'),
  ('e73741f9-a97c-4608-b2ba-553cbd59c2e7',	'nocart@gmail.com',	'$2b$10$7Sh500XmLTlCX7sk8V47ROqvZv6.om9b57kR.KSpW6sieuiu7c8vO',	'ADMIN',	'$2b$10$7Sh500XmLTlCX7sk8V47RO',	'2022-07-07');


INSERT INTO category (id, cname)
VALUES
  ('8bc81050-a6d8-417a-b348-50e68941d36b',	'bestsellers'),
  ('cfe944c2-54ff-455f-b5a9-1446b88a5db1',	'Milk Chocolate'),
  ('8c8f92db-8c77-4ff7-82f7-c3651006d4aa',	'Dark Chocolate'),
  ('8f5d8721-f0c4-4459-9469-c16db6290202',	'White Chocolate'),
  ('d0462c30-ddd6-4d01-bdf4-b94e0339e990',	'Chocolate boxes');


INSERT INTO promotions (id, title, url, image)
VALUES
  (19,	'White Chocolate',	'/products/White Chocolate',	'whitechocolate.jpg'),
  (20,	'Milk Chocolate',	'/products/Milk Chocolate',	'milk-choc.jpg'),
  (25,	'Dark Chocolate',	'/products/Dark Chocolate',	'dark-choc.jpg');

-- User Carts
-- INDETERMINATE IDs
INSERT INTO cart (id, user_id, createdAt)
VALUES
  ('1833ad6d-b21e-4f7d-9345-d317a5290cf9',	'ad64e856-3e74-4ddf-ad84-ce404483a3a3',	'2021-10-03'),
  ('6322c84f-b246-4f6d-9f93-ad18c20edc21',	'700e9b50-9bb9-42e0-bf6d-83ae38267649',	'2021-10-03'),
  ('331d7bda-4e53-462b-930d-f5715241154c',	'1d78343f-82e1-4af7-bcea-77b9d87f3538',	'2022-02-06');

INSERT INTO products (id, title, image, price, description, status, createdat, updatedat)
VALUES
  (222,	'Chocolate frosted cookies',	'choccookies.jpg',	9.5,	'i like cookies',	'IN_STOCK',	'2021-10-06',	'2021-10-06'),
  (40,	'Handmade Brownies',	'brownies.jpg',	6.5,	'A pack of 6 brownies that are handmade with fine ingredients and freshly made on an order.',	'IN_STOCK',	'2021-07-23',	'2021-07-23'),
  (41,	'Chocolate Chip Cookies',	'cookies.jpg',	5.5,	'A pack of 6 chocolate chip cookies that are handmade with fine ingredients and freshly made on an order.',	'IN_STOCK',	'2021-07-23',	'2021-07-23'),
  (42,	'Raspberry Chocolate',	'raspberry.jpg',	3.5,	'Delicious raspberry chocolate made from high quality raspberries and cooca',	'IN_STOCK',	'2021-07-23',	'2021-07-23'),
  (43,	'Hearts Chocolates',	'hearts.jpg',	4,	'Heart shaped milk chocolate made with fine ingredients',	'IN_STOCK',	'2021-07-23',	'2021-07-23'),
  (44,	'Fudge Rounds',	'fudgeround.jpg',	4.5,	'Delicious fudge chocolate with lovely chocolate filling that are made from finest ingredients',	'IN_STOCK',	'2021-07-23',	'2021-07-23'),
  (45,	'Handmade Chocolate Truffles',	'truffles.jpg',	7.5,	'Chocolate Truffles that are handmade with fresh ingredients and passion',	'IN_STOCK',	'2021-07-23',	'2021-07-23'),
  (46,	'Chocolate Balls',	'round.jpg',	7.5,	'A lovely mix of round chocolates with different flavors made from high quality cocoa',	'IN_STOCK',	'2021-07-23',	'2021-07-23'),
  (47,	'Dark Chocolate Nut Bars',	'darkbars.jpg',	4.25,	'Fine 75% Dark Chocolate that has been mixed with nuts made from high quality ingredients',	'IN_STOCK',	'2021-07-23',	'2021-07-23'),
  (48,	'Wheat Cream Biscuits',	'cremebiscuits.jpg',	3.75,	'Crunchy and fresh whey cream biscuits, comes with 10 for a pack.',	'IN_STOCK',	'2021-07-23',	'2021-07-23'),
  (36,	'Dark Chocolate Bar',	'bar.jpg',	2.5,	'Deliciously sweet and rich handcrafted dark chocolate bar made with passion.',	'IN_STOCK',	'2021-07-23',	'2021-07-23'),
  (37,	'Milk Chocolate Bar',	'milkslab.jpg',	4.5,	'Sweet milk chocolate made from fresh ingredients to ensure rich and creamy taste',	'IN_STOCK',	'2021-07-23',	'2021-07-23'),
  (39,	'Milk Hazelnut Chocolate',	'hazelnut.jpg',	3.5,	'Crunchy and creamy all in one, made with passion from high quality milk and cocoa beans.',	'IN_STOCK',	'2021-07-23',	'2021-07-23'),
  (49,	'Valentine Chocolates',	'confectionery.jpg',	7.5,	'Mix of valentines chocolates that are made from high quality ingredients',	'IN_STOCK',	'2021-07-23',	'2021-07-23'),
  (50,	'White and Milk Chocolate Mix',	'white.jpg',	8,	'Mix of white and milk chocolates that are made from fresh ingredients',	'IN_STOCK',	'2021-07-23',	'2021-07-23'),
  (51,	'Dark Chocolate Bars Pack',	'darkbar2.jpg',	8,	'200g Pack of 70% Dark Chocolates that are made from fresh high quality cocoa beans',	'IN_STOCK',	'2021-07-23',	'2021-07-23'),
  (52,	'Chocolate Chip Muffins',	'chipmuffins.jpg',	4.5,	'Pack of 4 chocolate chip muffins that are homemade with high quality ingredients',	'IN_STOCK',	'2021-07-23',	'2021-07-23'),
  (53,	'Raspberry Cake Slice',	'slicedjelly.jpg',	3.5,	'Lovely slice of raspberry cake made from fresh raspberries',	'IN_STOCK',	'2021-07-23',	'2021-07-23'),
  (54,	'Pack of Macaroons',	'macaroons.jpg',	6.5,	'Tasty and crunchy set of macaroons',	'IN_STOCK',	'2021-07-23',	'2021-07-23'),
  (55,	'Set of Dark Chocolates',	'freshdark.jpg',	5,	'65% Dark Chocolates made with fine ingredients',	'IN_STOCK',	'2021-07-23',	'2021-07-23'),
  (56,	'Dark Chocolate Bars',	'darkbars2.jpg',	4.25,	'85% Dark Chocolates made with fine ingredients',	'IN_STOCK',	'2021-07-23',	'2021-07-23'),
  (57,	'Milk Chocolate with nuts',	'nut.jpg',	4.5,	'Fresh milk chocolate made with high quality ingredients',	'IN_STOCK',	'2021-07-23',	'2021-07-23'),
  (58,	'White Chocolate Bar',	'whitechocolate.jpg',	4.5,	'Delicious white chocolate', 'IN_STOCK', '2021-07-23',	'2021-07-23'),
  (59,	'White Chocolate Bar',	'white2.jpg',	3.5, 'Delicious white chocolate',	'IN_STOCK',	'2021-07-23',	'2021-07-23'),
  (60,	'Delicious Sandwich',	'sandwich.jpg',	6.5,	'What is sandwich doing on a chocolate site? Dont ask me, I just run out of things to add',	'IN_STOCK',	'2021-07-23',	'2021-07-23'),
  (61,	'Delicious Burger',	'burgers.jpg',	6.5,	'Who doesnt love a juicy burger eh?',	'IN_STOCK',	'2021-07-23',	'2021-07-23'),
  (62,	'More Delicious White Chocolate',	'white3.jpg',	4.5,	'Delicious white chocolate made from fine ingredients',	'IN_STOCK',	'2021-07-23',	'2021-07-23');


-- Indeterminate IDs
INSERT INTO product_categories (product_id, category_id)
VALUES
  (36,	'8bc81050-a6d8-417a-b348-50e68941d36b'),
  (36,	'8c8f92db-8c77-4ff7-82f7-c3651006d4aa'),
  (37,	'cfe944c2-54ff-455f-b5a9-1446b88a5db1'),
  (37,	'8bc81050-a6d8-417a-b348-50e68941d36b'),
  (39,	'cfe944c2-54ff-455f-b5a9-1446b88a5db1'),
  (39,	'8bc81050-a6d8-417a-b348-50e68941d36b'),
  (40,	'8bc81050-a6d8-417a-b348-50e68941d36b'),
  (41,	'8bc81050-a6d8-417a-b348-50e68941d36b'),
  (42,	'8bc81050-a6d8-417a-b348-50e68941d36b'),
  (42,	'8c8f92db-8c77-4ff7-82f7-c3651006d4aa'),
  (43,	'cfe944c2-54ff-455f-b5a9-1446b88a5db1'),
  (43,	'8bc81050-a6d8-417a-b348-50e68941d36b'),
  (44,	'8bc81050-a6d8-417a-b348-50e68941d36b'),
  (45,	'8bc81050-a6d8-417a-b348-50e68941d36b'),
  (46,	'8bc81050-a6d8-417a-b348-50e68941d36b'),
  (46,	'd0462c30-ddd6-4d01-bdf4-b94e0339e990'),
  (47,	'8bc81050-a6d8-417a-b348-50e68941d36b'),
  (47,	'8c8f92db-8c77-4ff7-82f7-c3651006d4aa'),
  (48,	'8bc81050-a6d8-417a-b348-50e68941d36b'),
  (49,	'8bc81050-a6d8-417a-b348-50e68941d36b'),
  (49,	'8c8f92db-8c77-4ff7-82f7-c3651006d4aa'),
  (49,	'd0462c30-ddd6-4d01-bdf4-b94e0339e990'),
  (50,	'cfe944c2-54ff-455f-b5a9-1446b88a5db1'),
  (50,	'8bc81050-a6d8-417a-b348-50e68941d36b'),
  (50,	'8f5d8721-f0c4-4459-9469-c16db6290202'),
  (50,	'd0462c30-ddd6-4d01-bdf4-b94e0339e990'),
  (51,	'8bc81050-a6d8-417a-b348-50e68941d36b'),
  (51,	'8c8f92db-8c77-4ff7-82f7-c3651006d4aa'),
  (51,	'd0462c30-ddd6-4d01-bdf4-b94e0339e990'),
  (52,	'8bc81050-a6d8-417a-b348-50e68941d36b'),
  (53,	'8bc81050-a6d8-417a-b348-50e68941d36b'),
  (54,	'8bc81050-a6d8-417a-b348-50e68941d36b'),
  (55,	'8bc81050-a6d8-417a-b348-50e68941d36b'),
  (55,	'8c8f92db-8c77-4ff7-82f7-c3651006d4aa'),
  (55,	'd0462c30-ddd6-4d01-bdf4-b94e0339e990'),
  (56,	'8bc81050-a6d8-417a-b348-50e68941d36b'),
  (56,	'8c8f92db-8c77-4ff7-82f7-c3651006d4aa'),
  (56,	'd0462c30-ddd6-4d01-bdf4-b94e0339e990'),
  (57,	'cfe944c2-54ff-455f-b5a9-1446b88a5db1'),
  (57,	'8bc81050-a6d8-417a-b348-50e68941d36b'),
  (57,	'd0462c30-ddd6-4d01-bdf4-b94e0339e990'),
  (58,	'8bc81050-a6d8-417a-b348-50e68941d36b'),
  (58,	'8f5d8721-f0c4-4459-9469-c16db6290202'),
  (59,	'8bc81050-a6d8-417a-b348-50e68941d36b'),
  (59,	'8f5d8721-f0c4-4459-9469-c16db6290202'),
  (60,	'8bc81050-a6d8-417a-b348-50e68941d36b'),
  (61,	'8bc81050-a6d8-417a-b348-50e68941d36b'),
  (62,	'8bc81050-a6d8-417a-b348-50e68941d36b'),
  (62,	'8f5d8721-f0c4-4459-9469-c16db6290202'),
  (222,	'8bc81050-a6d8-417a-b348-50e68941d36b');


INSERT INTO orders (id, user_id, address, status, date, country, city, total_price, postalcode)
VALUES
  (uuid_generate_v4(),	'700e9b50-9bb9-42e0-bf6d-83ae38267649',	'Yeetstreet',	'PROCESSING',	'2022-07-06',	'Finland',	'Helsinki',	15,	'01000'),
  (uuid_generate_v4(),	'ad64e856-3e74-4ddf-ad84-ce404483a3a3',	'Yeetstreet',	'PROCESSING',	'2022-07-06',	'Finland',	'Helsinki',	15,	'01000'),
  (uuid_generate_v4(),	'ad64e856-3e74-4ddf-ad84-ce404483a3a3',	'Some street',	'PROCESSING',	'2022-07-06',	'Finland',	'Tampere',	25,	'33250'),
  (uuid_generate_v4(),	'ad64e856-3e74-4ddf-ad84-ce404483a3a3',	'Another street',	'PROCESSING',	'2022-07-06',	'Finland',	'Oulu',	265,	'90240');

-- INSERT INTO order_item (id, order_id, quantity, product_id, price)
-- VALUES
--   (197d207e-1ee0-4866-9d9a-5ba1a8effd0e,	30a524ef-3007-41bf-911d-1486c1579b54,	1,	40,	6.5),
--   (e54be8b8-870c-4752-91e8-bf5c1c470d40,	30a524ef-3007-41bf-911d-1486c1579b54,	11,	222,	19),
--   (abdded4e-7ee3-4c47-b71f-ed3768ff1656,	30a524ef-3007-41bf-911d-1486c1579b54,	1,	62,	4.5),
--   (c4d083a7-9d18-42ae-bdca-1ec6572c8793,	30a524ef-3007-41bf-911d-1486c1579b54,	1,	57,	4.5),
--   (c62a291a-b5e1-4fb7-89cd-b36cc5b511ea,	94b4400f-0024-4eeb-b1c8-02fc2d84bc37,	1,	57,	4.5),
--   (49f3fea7-3918-49a5-b8fa-68a7aa299e14,	94b4400f-0024-4eeb-b1c8-02fc2d84bc37,	11,	222,	19),
--   (c4e6ce0c-e0ad-4044-b0d4-b44f5458c529,	94b4400f-0024-4eeb-b1c8-02fc2d84bc37,	1,	40,	6.5),
--   (f2997c64-d097-4f55-a25a-10ca578f9141,	94b4400f-0024-4eeb-b1c8-02fc2d84bc37,	1,	62,	4.5),
--   (8c28d649-752e-4785-9788-1bc174b4ef84,	9b3990af-ee07-42ab-8d63-a2e6a3d2de47,	1,	57,	4.5),
--   (5df1d993-fe5d-4c60-b486-39133293d5f1,	9b3990af-ee07-42ab-8d63-a2e6a3d2de47,	11,	222,	19),
--   (5e974189-1c5c-4d9f-b6a4-082909a269df,	9b3990af-ee07-42ab-8d63-a2e6a3d2de47,	1,	62,	4.5),
--   (1efa0f0c-b8df-4b16-84ad-09ac0a1036f4,	9b3990af-ee07-42ab-8d63-a2e6a3d2de47,	11,	40,	13),
--   (3d9abf4f-73ee-4e6d-8689-cf398364df53,	5e73b390-ac90-4d25-a40c-df78e06dfdf9,	1,	57,	4.5),
--   (58cdc963-fd49-48f1-9eee-7884573141d0,	5e73b390-ac90-4d25-a40c-df78e06dfdf9,	11,	222,	19),
--   (ee7c037b-cb47-4c86-ba62-baee7a46ba28,	5e73b390-ac90-4d25-a40c-df78e06dfdf9,	1,	62,	4.5),
--   (c2493359-0241-4569-80d2-08881ef9eabb,	5e73b390-ac90-4d25-a40c-df78e06dfdf9,	11,	40,	13);

