<p align="center">
  <img src="https://i.imgur.com/SWs77TE.png" width="625" alt="front page" />
</p>

## Ecommerce demo client with React 17.0.2 and Redux 4.1.0

To build the client for production:
```console
$ npm run build
```

To run the client on development mode:
```console
$ npm run dev
```

### Integration tests

To run MSW API and jest tests:
```console
$ npm run test
```

### End-to-end tests

*Make sure client is on and connected to the database!*

To run end to end tests:
```console
$ npm run cypress:open
```

*The cypress test has to be run with `$ npm run dev` because cypress wont find paths otherwise with visit() function.*

#### About the client

Client with simple user access control, search functionality, category and product pages, profile- and admin dashboard, and checkout functionality. Does not use additional UI libraries besides React. Users also have ability to change their passwords and emails through "/profile-dashboard" page. Application uses NestJS as the backend that persists state to PostgreSQL v14.1. Authentication is done through jwts using passport-jwt library in the api. Client has shopping cart implemented through redux. The client is mobile responsive.

Website also has rudamentary notifications implemented through redux that are used for giving users of the page more information about the state of the application. There is also a "test user" seeded in the database, so that anyone can tests the admin dashboard features. Client users have also the ability to register to the website through the "/register" page, linked at "/login" page. Payment implemented through Stripe API, after succesful payment, user gets information page about their purchase and a downloadable invoice provided by the backend implemented through PDFKit. Testing provided through Jest, MSW and Cypress. Jest is used for testing some cart redux selectors, MSW is used for API testing and Cypress for e2e and integration testing.

For the environmental variables ('.env') file, define `PORT`, `HOST`, `SCHEME`, `production` and `STRIPE_PUBLISHABLE_KEY` to use Stripe's api.

*Images are from [unsplash](https://unsplash.com/) and [pexels](https://www.pexels.com/)*

## Client preview

![Demo of the client in action](./src/assets/preview.gif)
