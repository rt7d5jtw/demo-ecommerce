### About The Project

REST API built with NestJS 8.4.1 and TypeScript 4.7.4 for the [ecommerce-demo](https://github.com/rt7d5jtw/demo-ecommerce) client, interfaces with PostgreSQL 14.0 with TypeORM 0.3.7 to serve data to the client. API also has Swagger/OpenAPI to give definitions of the routes. Payment gateway is handled through Stripe API and client uses JWT's for authentication of the users, this is implemented through Passport libraries. Integration and end-to-end testing is implemented through jest and supertest.

* Swagger UI at: `localhost:3000/api`.

---

### ⚠️ Node.js Compatibility Note

This project was developed and tested primarily on **Node.js v17.3.0**.

For **Node.js versions 17 and higher (v18, v20, etc.)**, you may encounter build errors (`ERR_OSSL_EVP_UNSUPPORTED`) due to the adoption of OpenSSL 3.0, which deprecates older cryptographic algorithms used by some dependencies (like Webpack).

To resolve this locally, you must run build commands with the following compatibility flag:

```bash
# Set this environment variable when running 'npm run build' locally
export NODE_OPTIONS=--openssl-legacy-provider
```

---

## Easiest Way to Run: Docker Deployment

The recommended and simplest way to run this application, including the API, client, and the necessary PostgreSQL database, is using docker compose.
You must manually build the images *before* running `docker-compose up`.

### Prerequisites

1. **Pull Base Images:** Ensure you have the necessary base images (Node, Postgres) downloaded:

```console
$ docker pull node:18-alpine
$ docker pull postgres:14.1-alpine # Adjust based on your postgres image version
```

2. **Build the Image(s):** Build the appropriate image target (`dev` or `prod`).

* **For Development (API Only):**

```console
$ docker build -t ecommerce-demo --target dev .
```

* **For Production (Full Monolith):**

```console
# Make sure the client directory is cloned first!
$ docker build -t ecommerce-demo --target prod .
```

### Start the Environment

After successfully building the images, you can start the full environment:

```console
$ docker-compose up -d
```
#### Built With

* Tested on node 17.3.0 and npm 8.4.1

* [NestJS](https://github.com/nestjs/nest) v8.4.7
* [TypeORM](https://github.com/typeorm/typeorm) 0.3.7
* [PostgreSQL](https://github.com/postgres/postgres) v14.0

---

#### Quick Start for local deployment

```console
$ npm install
$ npm run build
$ npm --prefix ./client install
$ npm --prefix ./client run build
$ npm run start:prod
```

### Integration tests

```console
$ npm run test
```

### End-to-end tests

```console
$ npm run test:e2e
```

#### Quickstart for deployment with frontend

To deploy this application, install the packages first for the api with `npm install` and then for the client, `npm --prefix ./client run install` which install packages for the client, pointing to the `client/` directory (client is assumed to be in the directory). To build the api and the client you follow similar steps with `npm run build` to build the api and `npm --prefix ./client run build` to build the client. Run `npm run start:prod` to run the application in production, this serves the client from `client/dist/` and runs the api from `dist/`. Directory includes `.env` file template with predefined values that you can change on your own.

Note for windows users: you might have to use `npm run --prefix <directory> --cwd <your path> <command>`

#### Resources

The `res/` directory has the schema for database and also data for testing and running the application.

#### About

Tested to work on Node v17.3.0 and v12.22.5 in Debian 11, 5.10.0-10-amd64 release of linux kernel.

#### What is the client/ directory?

It is directory for the client, you're meant to place the client there

### Docker deployment

The Docker build is configured for Node.js 18 and includes the necessary compatibility flag to ensure client can be built without running into the OpenSSL error.
To run the docker deployment:

```console
$ docker-compose up
```

To clean up the docker deployment:

```console
$ sh res/clean.sh
```

The application can be deployed in docker by using `$ docker-compose up` and desired flags. Dockerfile builds on a NodeJS version 18.x and alpine, it builds both the api and the client and runs the application on production as a start point. Application serving port is set to be 3000 by default. The docker-compose.yml also pulls and sets up an image of postgres 14.1 that runs on port 5432 as is by default in postgres. Database is initialized with the `init.sql` file from `res/` directory. Be sure to modify the docker-compose.yml to your liking, by default it expects you to have an ready built image of the application.

`res/` directory also has shell scripts for deploying and cleaning up the docker deployment, use this with precaution. `startup.sh` runs `docker-compose up -d` and runs a couple of tests for the containers.

### Note on table mapping with models and data.sql

In the res/ directory, data.sql contains both insertation.sql and schema.sql contents. This file can be used for deploying the application. Although TypeORM can generate tables at runtime, I've opted to utilize an existing schema definitions.

[migrations in TypeORM](https://typeorm.io/migrations)

**NOTE: This does not go over sequences and views! Those can also be modified with 'reassigned owned' as long as you're using +v8.2**.

To change the ownership from postgres to another user, remember to change table ownerships as well.

```bash
$ sudo -u postgres psql -d bookstore -c 'ALTER DATABASE bookstore OWNER to <user>;'
$ sudo -u postgres psql -d bookstore -c 'ALTER SCHEMA bookstore OWNER to <user>;'
```

```sql
ALTER TABLE public.cart OWNER to <another_user>;
ALTER TABLE public.cart_item OWNER to <another_user>;
ALTER TABLE public.category OWNER to <another_user>;
ALTER TABLE public.images OWNER to <another_user>;
ALTER TABLE public.order_item OWNER to <another_user>;
ALTER TABLE public.orders OWNER to <another_user>;
ALTER TABLE public.product_categories OWNER to <another_user>;
ALTER TABLE public.products OWNER to <another_user>;
ALTER TABLE public.promotions OWNER to <another_user>;
ALTER TABLE public.typeorm_metadata OWNER to <another_user>;
ALTER TABLE public.users OWNER to <another_user>;
```

#### Prerequisites

This project can be run in two ways.

**1. For Docker Deployment (Recommended)**

* docker (v20.10 or higher)
* docker-compose (v1.29 or higher)

**2. For Local Development (Manual Setup)**

* Node.js: Must be compatible with the versions tested (v17.3.0) or higher, requiring the OpenSSL legacy flag.

**Recommended:** Use Node Version Manager (nvm) and the provided `.nvmrc` file for version management.

* npm: Version 8.4.1 or higher
* PostgreSQL: Version 13.0 or higher, running locally, unless disabled when using Docker.
* TypeScript: Version 4.7.4 or higher.
