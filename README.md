<p align="center">
  <img src="https://i.imgur.com/SWs77TE.png" width="625" alt="front page" />
</p>

## Confectionary app -- ecommerce client with React and Redux

To build the client for production:
```console
$ npm run build
```

To run the client on development mode:
```console
$ npm run dev
```

To run MSW API and jest tests:
```console
$ npm run test
```

To run end to end tests:
```console
$ npm run dev & disown
$ npm run cypress:open
```

The cypress test has to be run with `$ npm run dev` because cypress wont find paths otherwise with visit() function.

#### About the client

Client with simple user access control, search functionality, category and product pages, profile- and admin dashboard, and checkout. Does not use additional UI libraries besides React. Users also have ability to change their passwords and emails through "/profile-dashboard" page. Application uses NestJS as the backend that persists state to postgresql. Authentication is done through NestJS that implements it through passport library using JWTs. Client has shopping cart implemented through redux. The client is mobile responsive.

Website also has notifications implemented through redux that are used for giving client a "test user", so that anyone can tests the admin dashboard features. Client users have also the ability to register to the website through the "/register" page, linked at "/login" page. Notifications also give information for the users about state changes being succesful or not. Payments implemented through Stripe API, after succesful payment, user gets information page about their purchase and a downloadable invoice provided by the backend implemented through PDFKit.

Testing provided through Jest, MSW and Cypress. Jest is used for testing some cart redux selectors, MSW is used for API testing and Cypress for e2e and integration testing.
  

*Images are from [unsplash](https://unsplash.com/) and [pexels](https://www.pexels.com/)*
