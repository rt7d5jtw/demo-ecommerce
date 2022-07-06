import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { User } from '../src/users/user.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let jwt: { accessToken: string };
  // To track state mutations.
  const cleanup: Map<string, Array<any>> = new Map();

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // Assings { accessToken: <JWT> } to the jwt variable.
  beforeAll(async () => {
    const auth = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: 'testing@user.com', password: 'testing123' })
      .set('Accept', 'application/json');

    jwt = auth.body;

    const res = await request(app.getHttpServer())
      .get('/users')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${jwt['accessToken']}`);

    if (res.statusCode != 200)
      throw new Error(
        `The initial user for the testing environment could not be gotten before any test were even started! GET /users Failed!`
      );
  });

  describe('products', () => {
    it(`/product (GET)' -- Calls the ProductController.fetch to return all the products`, async () => {
      const result = await request(app.getHttpServer()).get('/product');
      expect(result.statusCode).toEqual(200);
      expect(result.body).not.toHaveLength(0);
      expect(result.body[0]).toMatchObject({
        categories: expect.any(Array),
        createdAt: expect.any(String),
        description: expect.any(String),
        id: expect.any(Number),
        image: expect.any(String),
        price: expect.any(Number),
        status: expect.any(String),
        title: expect.any(String),
        updatedAt: expect.any(String)
      });
    });

    it(`/product/:id (GET)' -- Calls the ProductController.fetchById to return the product by the specified ID`, async () => {
      const ProductID = 62;
      const result = await request(app.getHttpServer()).get(
        '/product/' + ProductID
      );
      expect(result.statusCode).toEqual(200);
      expect(result.body).not.toBeFalsy;
      expect(result.body).toMatchObject({
        categories: [
          { cname: expect.any(String), id: expect.any(String) },
          { cname: expect.any(String), id: expect.any(String) }
        ],
        createdAt: expect.any(String),
        description: expect.any(String),
        id: expect.any(Number),
        image: expect.any(String),
        price: expect.any(Number),
        status: expect.any(String),
        title: expect.any(String),
        updatedAt: expect.any(String)
      });
    });

    it(`/product (POST) -- Creates an product by calling ProductController.create to create a Product and return it in response body.`, async () => {
      const result = await request(app.getHttpServer())
        .post('/product')
        .send({
          title: 'is this working',
          image: 'chocolate.jpg',
          price: '9.50',
          description: 'i like chocolate',
          categoryIds: [
            {
              id: '4b625d6c-2a13-4616-870e-9fbb235af59d'
            }
          ]
        })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${jwt['accessToken']}`);

      expect(result.statusCode).toEqual(201);
      expect(result.body).toMatchObject({
        title: expect.any(String),
        image: expect.any(String),
        price: expect.any(String),
        description: expect.any(String),
        status: expect.any(String),
        categories: expect.any(Array),
        id: expect.any(Number),
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      });

      // New Product ID
      cleanup.set('products', [result.body['id']]);
    });

    it(`/product/:id (PATCH) -- Calls AuthController.update to update the product with inputs and return it in the Response Body`, async () => {
      const ProductID = cleanup.get('products')[0]; // Product to be updated.
      const result = await request(app.getHttpServer())
        .patch('/product/' + ProductID)
        .send({
          title: 'it is working :)',
          price: 1420,
          description: 'This was updated',
          categoryIds: [
            {
              id: '7779f6be-3725-41b0-9124-369731b26d4a'
            },
            {
              id: 'a47ba957-a742-45de-8610-13ba3e0ba4a0'
            }
          ]
        })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${jwt['accessToken']}`);

      expect(result.statusCode).toEqual(200);
      expect(result.body).toMatchObject({
        title: 'it is working :)',
        price: 1420,
        description: 'This was updated',
        image: expect.any(String),
        status: expect.any(String),
        categories: expect.any(Array),
        id: expect.any(Number),
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      });
    });

    it(`/product/:id (DELETE) -- Calls AuthController.remove to remove the product by the specified ID`, async () => {
      const ProductID = cleanup.get('products')[0]; // Product to be deleted.
      const result = await request(app.getHttpServer())
        .delete('/product/' + ProductID)
        .set('Authorization', `Bearer ${jwt['accessToken']}`);
      expect(result.statusCode).toEqual(200);

      // Mark the state change -- The new product was cleared from the state.
      cleanup.get('products').pop();
    });
  });

  describe('users', () => {
    let cachedId = null;
    it(`/users (GET) -- Calls UsersController.fetch to return all the users`, async () => {
      const result = await request(app.getHttpServer())
        .get('/users')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${jwt['accessToken']}`);
      expect(result.statusCode).toEqual(200);
      expect(result.body).toBeDefined();
      expect(result.body).toBeInstanceOf(Array);
      expect(result.body[0]).toMatchObject({
        id: expect.any(String),
        email: expect.any(String),
        password: expect.any(String),
        role: expect.any(String),
        salt: expect.any(String),
        createdAt: expect.any(String)
      });

      cachedId = result.body[0]['id']; // Set the ID for the next operation
    });

    it(`/users/:id (GET) -- Calls UsersController.fetchById to return the user by the specified id`, async () => {
      const result = await request(app.getHttpServer())
        .get('/users/' + cachedId)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${jwt['accessToken']}`);
      expect(result.statusCode).toEqual(200);
      expect(result.body).toBeDefined();
      expect(result.body).toMatchObject({
        id: expect.any(String),
        email: expect.any(String),
        password: expect.any(String),
        role: expect.any(String),
        salt: expect.any(String),
        createdAt: expect.any(String),
        orders: expect.any(Array)
      });
    });

    it(`/users (POST) -- Calls UsersController.createUser to create a user by the specified inputs and return it`, async () => {
      const result = await request(app.getHttpServer())
        .post('/users/')
        .send({ email: 'toot@gmail.com', password: 'yeetmageet123' })
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${jwt['accessToken']}`);

      expect(result.statusCode).toEqual(201);
      expect(result.body).toEqual({
        id: expect.any(String),
        email: expect.any(String),
        password: expect.any(String),
        role: expect.any(String),
        salt: expect.any(String),
        createdAt: expect.any(String)
      });

      // State gets mutated -- mark the state change.
      cleanup.set('users', [result.body['id']]);

      // NOTE: We use this user to do some of the update (PATCH) requests, this way state mutations are easier to track.
      // Resigning in! Acquire new JWT (This is required!)
      const auth = await request(app.getHttpServer())
        .post('/auth/signin')
        .send({ email: 'toot@gmail.com', password: 'yeetmageet123' })
        .set('Accept', 'application/json');

      jwt = auth.body;
    });

    it(`/users/:id/role (PATCH) -- Calls UsersController.updateUserRole to change the current User role to the new assigned role specified by the parameters, returns the new role of the User.`, async () => {
      const result = await request(app.getHttpServer())
        .patch(`/users/${cleanup.get('users')[0]}/role`)
        .send({
          role: 'ADMIN'
        })
        .set('Content-Type', 'application/json')
        .set('Accept', '*/*')
        .set('Accept-Encoding', 'gzip, deflate, br')
        .set('Authorization', `Bearer ${jwt['accessToken']}`);

      expect(result.statusCode).toEqual(200);
      expect(result.text).toEqual('ADMIN');
      expect(result.headers['content-length']).toEqual('5');
    });

    it(`/users/email (PATCH) -- Calls UsersController.changeEmail to change the current email address of the User, returns the new email.`, async () => {
      const result = await request(app.getHttpServer())
        .patch('/users/email')
        .send({
          currentEmail: 'toot@gmail.com',
          newEmail: 'moo@gmail.com'
        })
        .set('Accept', '*/*')
        .set('Authorization', `Bearer ${jwt['accessToken']}`);

      expect(result.statusCode).toEqual(200);
      expect(result.text).toEqual('moo@gmail.com');

      // Acquire new JWT (This is required!)
      const auth = await request(app.getHttpServer())
        .post('/auth/signin')
        .send({ email: 'moo@gmail.com', password: 'yeetmageet123' })
        .set('Accept', 'application/json');

      jwt = auth.body;
    });

    it(`/users/changepw (PATCH) -- Calls UsersController.changePassword to change the current password of the User. Returns the salted and hashed password.`, async () => {
      const result = await request(app.getHttpServer())
        .patch('/users/changepw')
        .send({
          currentPassword: 'yeetmageet123',
          newPassword:
            'ADkwi52epm5zzAkfbEgxjfE7mkdujxv5jEw5qfADdDy4uAtkvr7cfukuwg323w2wfbaviDpiDjjq2E499AqC9eEyDdFx9z2gktEokFh7dgnf9h'
        })
        .set('Accept', '*/*')
        .set('Accept-Encoding', 'gzip, deflate, br')
        .set('Connection', 'keep-alive')
        .set('Authorization', `Bearer ${jwt['accessToken']}`);

      expect(result.statusCode).toEqual(200);
      expect(result.text).toMatch(/^\$2[ayb]\$.{56}$/gi);

      // Acquire new JWT (This is required!)
      const auth = await request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          email: 'moo@gmail.com',
          password:
            'ADkwi52epm5zzAkfbEgxjfE7mkdujxv5jEw5qfADdDy4uAtkvr7cfukuwg323w2wfbaviDpiDjjq2E499AqC9eEyDdFx9z2gktEokFh7dgnf9h'
        })
        .set('Accept', 'application/json');

      jwt = auth.body;
    });

    it(`/auth/signin (POST) -- Calls AuthController.signIn to sign in the user, returning jwt`, async () => {
      const result = await request(app.getHttpServer())
        .post('/auth/signin')
        .send({ email: 'meemau@gmail.com', password: 'habbo1234' })
        .set('Accept', 'application/json');

      expect(result.statusCode).toEqual(201);
      expect(result.body).toMatchObject({
        accessToken: expect.any(String)
      });
      expect(result.body['accessToken']).toMatch(
        /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/
      );

      // Assigning the new JWT
      jwt = result.body;
    });

    it(`/users/:id (DELETE) -- Calls UsersController.remove to remove the user specified by the ID in the parameter`, async () => {
      // Using this test for getting rid of the new User that was created, this also cleans up the state.
      const UserID = cleanup.get('users')[0]; // User to delete.
      const result = await request(app.getHttpServer())
        .delete('/users/' + UserID)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${jwt['accessToken']}`);
      expect(result.statusCode).toEqual(200);

      cleanup.get('users').pop();
    });
  });

  describe('promotions', () => {
    it(`/promotions (GET) -- Calls PromotionsController.fetchAll to return all promotions`, async () => {
      const result = await request(app.getHttpServer())
        .get('/promotions')
        .set('Accept', 'application/json');
      expect(result.statusCode).toEqual(200);
      expect(result.body[0]).toMatchObject({
        id: expect.any(Number),
        title: expect.any(String),
        url: expect.any(String),
        image: expect.any(String)
      });
    });

    it(`/promotions (POST) -- Calls PromotionsController.create to create a new Promotion and return it.`, async () => {
      const result = await request(app.getHttpServer())
        .post('/promotions')
        .send({
          image: 'this is a test :)',
          title: 'testing',
          url: '/products/classics'
        })
        .set('Accept', '*/*')
        .set('Accept-Encoding', 'gzip, deflate, br')
        .set('Connection', 'keep-alive')
        .set('Authorization', `Bearer ${jwt['accessToken']}`);

      expect(result.statusCode).toEqual(201);
      expect(result.body).toEqual({
        title: 'testing',
        url: '/products/classics',
        image: 'this is a test :)',
        id: expect.any(Number)
      });

      cleanup.set('promotions', [result.body['id']]);
    });

    it(`/promotions/:id (PATCH) -- Calls PromotionsController.update to update a Promotion and return it.`, async () => {
      const PromotionID = cleanup.get('promotions')[0];
      const result = await request(app.getHttpServer())
        .patch('/promotions/' + PromotionID)
        .send({
          image: 'i like chocolate',
          title: 'fudge.jpg',
          url: '/products/chocolates'
        })
        .set('Accept', '*/*')
        .set('Accept-Encoding', 'gzip, deflate, br')
        .set('Connection', 'keep-alive')
        .set('Authorization', `Bearer ${jwt['accessToken']}`);

      expect(result.statusCode).toEqual(200);
      expect(result.body).toEqual({
        id: PromotionID,
        image: 'i like chocolate',
        title: 'fudge.jpg',
        url: '/products/chocolates'
      });
    });

    it(`/promotions/:id (DELETE) -- Calls PromotionsController.remove to remove a Promotion specified by the ID.`, async () => {
      const PromotionID = cleanup.get('promotions')[0];
      const result = await request(app.getHttpServer())
        .delete('/promotions/' + PromotionID)
        .set('Accept', '*/*')
        .set('Accept-Encoding', 'gzip, deflate, br')
        .set('Connection', 'keep-alive')
        .set('Authorization', `Bearer ${jwt['accessToken']}`);

      expect(result.statusCode).toEqual(200);
      cleanup.get('promotions').pop();
    });
  });

  describe('categories', () => {
    it(`/category (GET) -- Calls to CategoryController.fetch to return all categories.`, async () => {
      const result = await request(app.getHttpServer())
        .get('/category')
        .set('Accept', 'application/json')
        .set('Accept-Encoding', 'gzip, deflate, br')
        .set('Connection', 'keep-alive');

      expect(result.statusCode).toEqual(200);
      expect(result.body[0]).toEqual({
        id: expect.any(String),
        cname: expect.any(String)
      });
    });

    it(`/category (POST) -- Calls to CategoryController.create to create a new Category and return it.`, async () => {
      const result = await request(app.getHttpServer())
        .post('/category')
        .send({ cname: 'chocolate truffles' })
        .set('Accept', 'application/json')
        .set('Accept-Encoding', 'gzip, deflate, br')
        .set('Connection', 'keep-alive')
        .set('Authorization', `Bearer ${jwt['accessToken']}`);

      expect(result.statusCode).toEqual(201);
      expect(result.body).toEqual({
        id: expect.any(String),
        cname: 'chocolate truffles'
      });
      expect(result.body.id).toMatch(/^[A-Za-z0-9-_.+/=]*$/);

      cleanup.set('categories', [result.body['id']]);
    });

    it(`/category/:id (PATCH) -- Calls to CategoryController.update to assign new values to existing Category and return it.`, async () => {
      const CategoryID = cleanup.get('categories')[0];
      const result = await request(app.getHttpServer())
        .patch('/category/' + CategoryID)
        .send({ cname: 'gifts' })
        .set('Accept', 'application/json')
        .set('Accept-Encoding', 'gzip, deflate, br')
        .set('Connection', 'keep-alive')
        .set('Authorization', `Bearer ${jwt['accessToken']}`);

      expect(result.statusCode).toEqual(200);
      expect(result.body).toEqual({
        id: expect.any(String),
        cname: 'gifts'
      });
      expect(result.body.id).toMatch(/^[A-Za-z0-9-_.+/=]*$/);
    });

    it(`/category/:id (DELETE) -- Calls to CategoryController.remove to remove existing Category.`, async () => {
      const CategoryID = cleanup.get('categories')[0];
      const result = await request(app.getHttpServer())
        .delete('/category/' + CategoryID)
        .set('Accept', 'application/json')
        .set('Accept-Encoding', 'gzip, deflate, br')
        .set('Connection', 'keep-alive')
        .set('Authorization', `Bearer ${jwt['accessToken']}`);

      expect(result.statusCode).toEqual(200);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
