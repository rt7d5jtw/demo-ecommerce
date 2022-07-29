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
    created_at timestamp NOT NULL,
    updated_at timestamp
);

CREATE TABLE cart (
    id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    user_id uuid REFERENCES users (id),
    created_at timestamp NOT NULL
);

-- Changed from "cart-item" to cart_item
CREATE TABLE cart_item (
    id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    cart_id uuid REFERENCES cart (id),
    product_id SERIAL REFERENCES products (id),
    quantity INTEGER NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    created_at timestamp NOT NULL
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

-- Changed from "order-item" to order_item
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
