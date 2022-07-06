-- Contains schema and mock data for Confectionary application

--
-- PostgreSQL database dump
--


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cart; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "userId" uuid NOT NULL,
    "CreatedAt" date DEFAULT now() NOT NULL
);


ALTER TABLE public.cart OWNER TO postgres;

--
-- Name: cart-item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."cart-item" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "cartId" uuid NOT NULL,
    "productId" integer NOT NULL,
    quantity integer NOT NULL,
    price double precision NOT NULL,
    "CreatedAt" date DEFAULT now() NOT NULL
);


ALTER TABLE public."cart-item" OWNER TO postgres;

--
-- Name: category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.category (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    cname character varying NOT NULL
);


ALTER TABLE public.category OWNER TO postgres;

--
-- Name: images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.images (
    name text,
    img bytea
);


ALTER TABLE public.images OWNER TO postgres;

--
-- Name: order-item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."order-item" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "orderId" uuid NOT NULL,
    quantity integer NOT NULL,
    "productId" integer,
    price double precision NOT NULL
);


ALTER TABLE public."order-item" OWNER TO postgres;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "userId" uuid NOT NULL,
    address character varying NOT NULL,
    status character varying NOT NULL,
    date date DEFAULT now() NOT NULL,
    country character varying NOT NULL,
    city character varying NOT NULL,
    total_price double precision NOT NULL,
    postalcode character varying NOT NULL
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: product_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_categories (
    "productId" integer NOT NULL,
    "categoryId" uuid NOT NULL
);


ALTER TABLE public.product_categories OWNER TO postgres;

--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    title character varying NOT NULL,
    image character varying NOT NULL,
    price double precision NOT NULL,
    description character varying NOT NULL,
    status character varying NOT NULL,
    "createdAt" date DEFAULT now() NOT NULL,
    "updatedAt" date DEFAULT now() NOT NULL
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.products_id_seq OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: promotions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promotions (
    id integer NOT NULL,
    title character varying NOT NULL,
    url character varying NOT NULL,
    image character varying NOT NULL
);


ALTER TABLE public.promotions OWNER TO postgres;

--
-- Name: promotions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.promotions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.promotions_id_seq OWNER TO postgres;

--
-- Name: promotions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.promotions_id_seq OWNED BY public.promotions.id;


--
-- Name: typeorm_metadata; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.typeorm_metadata (
    type character varying NOT NULL,
    database character varying,
    schema character varying,
    "table" character varying,
    name character varying,
    value text
);


ALTER TABLE public.typeorm_metadata OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying NOT NULL,
    password character varying(150) NOT NULL,
    role character varying NOT NULL,
    salt character varying NOT NULL,
    registered_at date DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: promotions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions ALTER COLUMN id SET DEFAULT nextval('public.promotions_id_seq'::regclass);


--
-- Name: products PK_0806c755e0aca124e67c0cf6d7d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY (id);


--
-- Name: cart-item PK_0bab23e63a695e02f3b9496809b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."cart-item"
    ADD CONSTRAINT "PK_0bab23e63a695e02f3b9496809b" PRIMARY KEY (id);


--
-- Name: promotions PK_380cecbbe3ac11f0e5a7c452c34; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT "PK_380cecbbe3ac11f0e5a7c452c34" PRIMARY KEY (id);


--
-- Name: orders PK_710e2d4957aa5878dfe94e4ac2f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY (id);


--
-- Name: category PK_9c4e4a89e3674fc9f382d733f03; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY (id);


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: cart PK_c524ec48751b9b5bcfbf6e59be7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7" PRIMARY KEY (id);


--
-- Name: order-item PK_e06b16183c1f2f8b09f359ed572; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order-item"
    ADD CONSTRAINT "PK_e06b16183c1f2f8b09f359ed572" PRIMARY KEY (id);


--
-- Name: product_categories PK_e65c1adebf00d61f1c84a4f3950; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT "PK_e65c1adebf00d61f1c84a4f3950" PRIMARY KEY ("productId", "categoryId");


--
-- Name: cart REL_756f53ab9466eb52a52619ee01; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT "REL_756f53ab9466eb52a52619ee01" UNIQUE ("userId");


--
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- Name: IDX_6156a79599e274ee9d83b1de13; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_6156a79599e274ee9d83b1de13" ON public.product_categories USING btree ("productId");


--
-- Name: IDX_fdef3adba0c284fd103d0fd369; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fdef3adba0c284fd103d0fd369" ON public.product_categories USING btree ("categoryId");


--
-- Name: orders FK_151b79a83ba240b0cb31b2302d1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: order-item FK_29ee234059c3b7a783bddac5bf8; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order-item"
    ADD CONSTRAINT "FK_29ee234059c3b7a783bddac5bf8" FOREIGN KEY ("orderId") REFERENCES public.orders(id);


--
-- Name: product_categories FK_6156a79599e274ee9d83b1de139; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT "FK_6156a79599e274ee9d83b1de139" FOREIGN KEY ("productId") REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order-item FK_6811363ab71c6dca8ebc9db33f6; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order-item"
    ADD CONSTRAINT "FK_6811363ab71c6dca8ebc9db33f6" FOREIGN KEY ("productId") REFERENCES public.products(id);


--
-- Name: cart FK_756f53ab9466eb52a52619ee019; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT "FK_756f53ab9466eb52a52619ee019" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: cart-item FK_7f05d97bef35db4f1f4b2f8c412; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."cart-item"
    ADD CONSTRAINT "FK_7f05d97bef35db4f1f4b2f8c412" FOREIGN KEY ("cartId") REFERENCES public.cart(id) ON DELETE CASCADE;


--
-- Name: cart-item FK_a67753d8619db585e8825b755b9; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."cart-item"
    ADD CONSTRAINT "FK_a67753d8619db585e8825b755b9" FOREIGN KEY ("productId") REFERENCES public.products(id);


--
-- Name: product_categories FK_fdef3adba0c284fd103d0fd3697; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT "FK_fdef3adba0c284fd103d0fd3697" FOREIGN KEY ("categoryId") REFERENCES public.category(id) ON UPDATE CASCADE ON DELETE CASCADE;

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password, role, salt, registered_at) FROM stdin;
27502c8c-3fa9-48f5-a19c-776d6fb47dea	testing@user.com	$2b$10$xJcCBRZVJTVZX93Dw7BUsu2WpuwuaTH5iL7aWNOPKUhIfRuAGbR4i	GUEST	$2b$10$xJcCBRZVJTVZX93Dw7BUsu	2021-10-03
e6a23d5f-3a23-498f-9f61-ffb9ad34cb68	meemau@gmail.com	$2b$10$vQVlcMFTN5xVeg2ElZIFnuDDyt44OAOMUIf3Iv0Ly8iNdfT60CiZu	ADMIN	$2b$10$vQVlcMFTN5xVeg2ElZIFnu	2021-06-30
872f17ee-45a2-409b-b74a-eea6753f38fb	miumau@gmail.com	$2b$10$SyzY0wCknTEmvlvKqjP7x.uplLjt42YEXIYhpo0AClLfU0VqGgWh.	USER	$2b$10$SyzY0wCknTEmvlvKqjP7x.	2021-06-17
\.


--
-- Data for Name: cart; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart (id, "userId", "CreatedAt") FROM stdin;
8c019fbb-ff8a-4fb5-8d1d-6d31adb6c422	27502c8c-3fa9-48f5-a19c-776d6fb47dea	2021-10-03
9b2796f5-8e0e-42f1-9ee1-aec436933565	872f17ee-45a2-409b-b74a-eea6753f38fb	2021-10-03
32cc7d62-73d9-4033-b858-fde130c21afd	e6a23d5f-3a23-498f-9f61-ffb9ad34cb68	2022-02-06
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, title, image, price, description, status, "createdAt", "updatedAt") FROM stdin;
222	Chocolate frosted cookies	choccookies.jpg	9.5	i like cookies	IN_STOCK	2021-10-06	2021-10-06
40	Handmade Brownies	brownies.jpg	6.5	A pack of 6 brownies that are handmade with fine ingredients and freshly made on an order.	IN_STOCK	2021-07-23	2021-07-23
41	Chocolate Chip Cookies	cookies.jpg	5.5	A pack of 6 chocolate chip cookies that are handmade with fine ingredients and freshly made on an order.	IN_STOCK	2021-07-23	2021-07-23
42	Raspberry Chocolate	raspberry.jpg	3.5	Delicious raspberry chocolate made from high quality raspberries and cooca	IN_STOCK	2021-07-23	2021-07-23
43	Hearts Chocolates	hearts.jpg	4	Heart shaped milk chocolate made with fine ingredients	IN_STOCK	2021-07-23	2021-07-23
44	Fudge Rounds	fudgeround.jpg	4.5	Delicious fudge chocolate with lovely chocolate filling that are made from finest ingredients	IN_STOCK	2021-07-23	2021-07-23
45	Handmade Chocolate Truffles	truffles.jpg	7.5	Chocolate Truffles that are handmade with fresh ingredients and passion	IN_STOCK	2021-07-23	2021-07-23
46	Chocolate Balls	round.jpg	7.5	A lovely mix of round chocolates with different flavors made from high quality cocoa	IN_STOCK	2021-07-23	2021-07-23
47	Dark Chocolate Nut Bars	darkbars.jpg	4.25	Fine 75% Dark Chocolate that has been mixed with nuts made from high quality ingredients	IN_STOCK	2021-07-23	2021-07-23
48	Wheat Cream Biscuits	cremebiscuits.jpg	3.75	Crunchy and fresh whey cream biscuits, comes with 10 for a pack.	IN_STOCK	2021-07-23	2021-07-23
36	Dark Chocolate Bar	bar.jpg	2.5	Deliciously sweet and rich handcrafted dark chocolate bar made with passion.	IN_STOCK	2021-07-23	2021-07-23
37	Milk Chocolate Bar	milkslab.jpg	4.5	Sweet milk chocolate made from fresh ingredients to ensure rich and creamy taste	IN_STOCK	2021-07-23	2021-07-23
39	Milk Hazelnut Chocolate	hazelnut.jpg	3.5	Crunchy and creamy all in one, made with passion from high quality milk and cocoa beans.	IN_STOCK	2021-07-23	2021-07-23
49	Valentine Chocolates	confectionery.jpg	7.5	Mix of valentines chocolates that are made from high quality ingredients	IN_STOCK	2021-07-23	2021-07-23
50	White and Milk Chocolate Mix	white.jpg	8	Mix of white and milk chocolates that are made from fresh ingredients	IN_STOCK	2021-07-23	2021-07-23
51	Dark Chocolate Bars Pack	darkbar2.jpg	8	200g Pack of 70% Dark Chocolates that are made from fresh high quality cocoa beans	IN_STOCK	2021-07-23	2021-07-23
52	Chocolate Chip Muffins	chipmuffins.jpg	4.5	Pack of 4 chocolate chip muffins that are homemade with high quality ingredients	IN_STOCK	2021-07-23	2021-07-23
53	Raspberry Cake Slice	slicedjelly.jpg	3.5	Lovely slice of raspberry cake made from fresh raspberries	IN_STOCK	2021-07-23	2021-07-23
54	Pack of Macaroons	macaroons.jpg	6.5	Tasty and crunchy set of macaroons	IN_STOCK	2021-07-23	2021-07-23
55	Set of Dark Chocolates	freshdark.jpg	5	65% Dark Chocolates made with fine ingredients	IN_STOCK	2021-07-23	2021-07-23
56	Dark Chocolate Bars	darkbars2.jpg	4.25	85% Dark Chocolates made with fine ingredients	IN_STOCK	2021-07-23	2021-07-23
57	Milk Chocolate with nuts	nut.jpg	4.5	Fresh milk chocolate made with high quality ingredients	IN_STOCK	2021-07-23	2021-07-23
58	White Chocolate Bar	whitechocolate.jpg	4.5	Delicious white chocolate	IN_STOCK	2021-07-23	2021-07-23
59	White Chocolate Bar	white2.jpg	3.5	Delicious white chocolate	IN_STOCK	2021-07-23	2021-07-23
60	Delicious Sandwich	sandwich.jpg	6.5	What is sandwich doing on a chocolate site? Dont ask me, I just run out of things to add	IN_STOCK	2021-07-23	2021-07-23
61	Delicious Burger	burgers.jpg	6.5	Who doesn't love a juicy burger eh?	IN_STOCK	2021-07-23	2021-07-23
62	More Delicious White Chocolate	white3.jpg	4.5	Delicious white chocolate made from fine ingredients	IN_STOCK	2021-07-23	2021-07-23
\.


--
-- Data for Name: cart-item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."cart-item" (id, "cartId", "productId", quantity, price, "CreatedAt") FROM stdin;
b0a5bd87-f37b-4f46-8e44-e18ecd41f53d	32cc7d62-73d9-4033-b858-fde130c21afd	40	1	6.5	2022-07-06
67ca5c80-6eb8-419b-ba03-977da757f319	32cc7d62-73d9-4033-b858-fde130c21afd	222	11	19	2022-07-06
f8ef489b-f3fc-44b8-a198-03295f1300e1	32cc7d62-73d9-4033-b858-fde130c21afd	62	1	4.5	2022-07-06
022e84d9-5247-4630-922e-35dc69241b12	32cc7d62-73d9-4033-b858-fde130c21afd	57	1	4.5	2022-07-06
444a0883-a9b9-4255-95ec-80daca6f484f	8c019fbb-ff8a-4fb5-8d1d-6d31adb6c422	57	1	4.5	2022-07-06
f03713fb-f9c5-4642-8d4e-ed160628cce8	8c019fbb-ff8a-4fb5-8d1d-6d31adb6c422	222	11	19	2022-07-06
f389f353-9b2c-4fad-85d5-4ee9d2107cd4	8c019fbb-ff8a-4fb5-8d1d-6d31adb6c422	62	1	4.5	2022-07-06
62bfbe2d-62f1-4818-bcfe-4599f738c07f	8c019fbb-ff8a-4fb5-8d1d-6d31adb6c422	40	11	13	2022-07-06
\.

--
-- Data for Name: category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.category (id, cname) FROM stdin;
a47ba957-a742-45de-8610-13ba3e0ba4a0	bestsellers
dcaa9f09-0dbe-4e81-af92-e15ee487beaa	Milk Chocolate
4b625d6c-2a13-4616-870e-9fbb235af59d	Dark Chocolate
7779f6be-3725-41b0-9124-369731b26d4a	White Chocolate
654fe5e3-c013-4127-8896-a7cd800625a2	Chocolate boxes
\.


--
-- Data for Name: images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.images (name, img) FROM stdin;
\.

--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, "userId", address, status, date, country, city, total_price, postalcode) FROM stdin;
30a524ef-3007-41bf-911d-1486c1579b54	e6a23d5f-3a23-498f-9f61-ffb9ad34cb68	Yeetstreet	PROCESSING	2022-07-06	Finland	Helsinki	15	01000
94b4400f-0024-4eeb-b1c8-02fc2d84bc37	27502c8c-3fa9-48f5-a19c-776d6fb47dea	Yeetstreet	PROCESSING	2022-07-06	Finland	Helsinki	15	01000
9b3990af-ee07-42ab-8d63-a2e6a3d2de47	27502c8c-3fa9-48f5-a19c-776d6fb47dea	Some street	PROCESSING	2022-07-06	Finland	Tampere	25	33250
5e73b390-ac90-4d25-a40c-df78e06dfdf9	27502c8c-3fa9-48f5-a19c-776d6fb47dea	Another street	PROCESSING	2022-07-06	Finland	Oulu	265	90240
\.


--
-- Data for Name: order-item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."order-item" (id, "orderId", quantity, "productId", price) FROM stdin;
197d207e-1ee0-4866-9d9a-5ba1a8effd0e	30a524ef-3007-41bf-911d-1486c1579b54	1	40	6.5
e54be8b8-870c-4752-91e8-bf5c1c470d40	30a524ef-3007-41bf-911d-1486c1579b54	11	222	19
abdded4e-7ee3-4c47-b71f-ed3768ff1656	30a524ef-3007-41bf-911d-1486c1579b54	1	62	4.5
c4d083a7-9d18-42ae-bdca-1ec6572c8793	30a524ef-3007-41bf-911d-1486c1579b54	1	57	4.5
c62a291a-b5e1-4fb7-89cd-b36cc5b511ea	94b4400f-0024-4eeb-b1c8-02fc2d84bc37	1	57	4.5
49f3fea7-3918-49a5-b8fa-68a7aa299e14	94b4400f-0024-4eeb-b1c8-02fc2d84bc37	11	222	19
c4e6ce0c-e0ad-4044-b0d4-b44f5458c529	94b4400f-0024-4eeb-b1c8-02fc2d84bc37	1	40	6.5
f2997c64-d097-4f55-a25a-10ca578f9141	94b4400f-0024-4eeb-b1c8-02fc2d84bc37	1	62	4.5
8c28d649-752e-4785-9788-1bc174b4ef84	9b3990af-ee07-42ab-8d63-a2e6a3d2de47	1	57	4.5
5df1d993-fe5d-4c60-b486-39133293d5f1	9b3990af-ee07-42ab-8d63-a2e6a3d2de47	11	222	19
5e974189-1c5c-4d9f-b6a4-082909a269df	9b3990af-ee07-42ab-8d63-a2e6a3d2de47	1	62	4.5
1efa0f0c-b8df-4b16-84ad-09ac0a1036f4	9b3990af-ee07-42ab-8d63-a2e6a3d2de47	11	40	13
3d9abf4f-73ee-4e6d-8689-cf398364df53	5e73b390-ac90-4d25-a40c-df78e06dfdf9	1	57	4.5
58cdc963-fd49-48f1-9eee-7884573141d0	5e73b390-ac90-4d25-a40c-df78e06dfdf9	11	222	19
ee7c037b-cb47-4c86-ba62-baee7a46ba28	5e73b390-ac90-4d25-a40c-df78e06dfdf9	1	62	4.5
c2493359-0241-4569-80d2-08881ef9eabb	5e73b390-ac90-4d25-a40c-df78e06dfdf9	11	40	13
\.

--
-- Data for Name: product_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_categories ("productId", "categoryId") FROM stdin;
36	a47ba957-a742-45de-8610-13ba3e0ba4a0
36	4b625d6c-2a13-4616-870e-9fbb235af59d
37	dcaa9f09-0dbe-4e81-af92-e15ee487beaa
37	a47ba957-a742-45de-8610-13ba3e0ba4a0
39	dcaa9f09-0dbe-4e81-af92-e15ee487beaa
39	a47ba957-a742-45de-8610-13ba3e0ba4a0
40	a47ba957-a742-45de-8610-13ba3e0ba4a0
41	a47ba957-a742-45de-8610-13ba3e0ba4a0
42	a47ba957-a742-45de-8610-13ba3e0ba4a0
42	4b625d6c-2a13-4616-870e-9fbb235af59d
43	dcaa9f09-0dbe-4e81-af92-e15ee487beaa
43	a47ba957-a742-45de-8610-13ba3e0ba4a0
44	a47ba957-a742-45de-8610-13ba3e0ba4a0
45	a47ba957-a742-45de-8610-13ba3e0ba4a0
46	a47ba957-a742-45de-8610-13ba3e0ba4a0
46	654fe5e3-c013-4127-8896-a7cd800625a2
47	a47ba957-a742-45de-8610-13ba3e0ba4a0
47	4b625d6c-2a13-4616-870e-9fbb235af59d
48	a47ba957-a742-45de-8610-13ba3e0ba4a0
49	a47ba957-a742-45de-8610-13ba3e0ba4a0
49	4b625d6c-2a13-4616-870e-9fbb235af59d
49	654fe5e3-c013-4127-8896-a7cd800625a2
50	dcaa9f09-0dbe-4e81-af92-e15ee487beaa
50	a47ba957-a742-45de-8610-13ba3e0ba4a0
50	7779f6be-3725-41b0-9124-369731b26d4a
50	654fe5e3-c013-4127-8896-a7cd800625a2
51	a47ba957-a742-45de-8610-13ba3e0ba4a0
51	4b625d6c-2a13-4616-870e-9fbb235af59d
51	654fe5e3-c013-4127-8896-a7cd800625a2
52	a47ba957-a742-45de-8610-13ba3e0ba4a0
53	a47ba957-a742-45de-8610-13ba3e0ba4a0
54	a47ba957-a742-45de-8610-13ba3e0ba4a0
55	a47ba957-a742-45de-8610-13ba3e0ba4a0
55	4b625d6c-2a13-4616-870e-9fbb235af59d
55	654fe5e3-c013-4127-8896-a7cd800625a2
56	a47ba957-a742-45de-8610-13ba3e0ba4a0
56	4b625d6c-2a13-4616-870e-9fbb235af59d
56	654fe5e3-c013-4127-8896-a7cd800625a2
57	dcaa9f09-0dbe-4e81-af92-e15ee487beaa
57	a47ba957-a742-45de-8610-13ba3e0ba4a0
57	654fe5e3-c013-4127-8896-a7cd800625a2
58	a47ba957-a742-45de-8610-13ba3e0ba4a0
58	7779f6be-3725-41b0-9124-369731b26d4a
59	a47ba957-a742-45de-8610-13ba3e0ba4a0
59	7779f6be-3725-41b0-9124-369731b26d4a
60	a47ba957-a742-45de-8610-13ba3e0ba4a0
61	a47ba957-a742-45de-8610-13ba3e0ba4a0
62	a47ba957-a742-45de-8610-13ba3e0ba4a0
62	7779f6be-3725-41b0-9124-369731b26d4a
222	a47ba957-a742-45de-8610-13ba3e0ba4a0
\.


--
-- Data for Name: promotions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.promotions (id, title, url, image) FROM stdin;
19	White Chocolate	/products/White Chocolate	whitechocolate.jpg
20	Milk Chocolate	/products/Milk Chocolate	milk-choc.jpg
25	Dark Chocolate	/products/Dark Chocolate	dark-choc.jpg
\.


--
-- Data for Name: typeorm_metadata; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.typeorm_metadata (type, database, schema, "table", name, value) FROM stdin;
\.


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 234, true);


--
-- Name: promotions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.promotions_id_seq', 98, true);


--
-- PostgreSQL database dump complete
--

