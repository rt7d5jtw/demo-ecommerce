-- The application schema for MySQL and MariaDB (tested on MariaDB 10.3)

-- Tables
CREATE TABLE users (
    id BINARY(16) NOT NULL PRIMARY KEY,
    email VARCHAR(254) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(10) NOT NULL,
    salt VARBINARY(64) NOT NULL,
    registered_at timestamp NOT NULL,
    unique(email)
);

CREATE TABLE products (
    id INTEGER NOT NULL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image VARCHAR(255) NOT NULL,
    price DOUBLE NOT NULL,
    description VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
    createdAt timestamp NOT NULL,
    updatedAt timestamp NOT NULL
);

CREATE TABLE cart (
    id BINARY(16) NOT NULL PRIMARY KEY,
    user_id BINARY(16) NOT NULL,
    createdAt timestamp NOT NULL,
    constraint fk_cart_user foreign key (user_id) references users (id)
);

-- Changed from "cart-item" to cart_item
CREATE TABLE cart_item (
    id BINARY(16) NOT NULL PRIMARY KEY,
    cart_id BINARY(16) NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price DOUBLE NOT NULL,
    createdAt timestamp NOT NULL,
    constraint fk_cartitem_cart foreign key (cart_id) references cart (id),
    constraint fk_cartitem_product foreign key (product_id) references products (id)
);

CREATE TABLE category (
    id BINARY(16) NOT NULL PRIMARY KEY,
    cname VARCHAR(255) NOT NULL
);

CREATE TABLE orders (
    id BINARY(16) NOT NULL PRIMARY KEY,
    user_id BINARY(16) NOT NULL,
    address VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    country VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    total_price DOUBLE NOT NULL,
    postalcode VARCHAR(255) NOT NULL,
    constraint fk_orders_user foreign key (user_id) references users (id)
);

-- Changed from "order-item" to order_item
CREATE TABLE order_item (
    id BINARY(16) NOT NULL PRIMARY KEY,
    order_id BINARY(16) NOT NULL,
    quantity INTEGER NOT NULL,
    productId INTEGER,
    price DOUBLE NOT NULL,
    constraint fk_orderitem_order foreign key (order_id) references orders (id)
);

CREATE TABLE product_categories (
    product_id INTEGER not null,
    category_id BINARY(16) NOT NULL,
    constraint fk_productcategories_product foreign key (product_id) references products (id),
    constraint fk_productcategories_category foreign key (category_id) references category (id)
);

CREATE TABLE promotions (
    id INTEGER NOT NULL PRIMARY KEY,
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
