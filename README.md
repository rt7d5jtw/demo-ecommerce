<p align="center">
  <img src="https://i.imgur.com/SWs77TE.png" width="625" alt="front page" />
</p>

## Chocolatiste, <i>Demo confectionery client with React and Redux.</i>

<p>Client with simple user access control, profile- and admin dashboard, and checkout. Does not use additional UI libraries besides React. Users also have ability to change their passwords and emails through "/profile-dashboard" page. Application uses NestJS as the backend that persists state to postgresql. Authentication is done through NestJS that implements it through passport library using JWTs. Client has shopping cart implemented through redux. The client is mobile responsive.</p>

<p>Testing provided through Jest, MSW and Cypress. Jest is used for testing some cart redux selectors, MSW is used for API testing and Cypress for e2e and integration testing.</p>

<p>Website also has notifications implemented through redux that are used for giving client a "test user", so that anyone can tests the admin dashboard features. Client users have also the ability to register to the website through the "/register" page, linked at "/login" page. Notifications also give information for the users about state changes being succesful or not. Payments implemented through Stripe API, after succesful payment, user gets information page about their purchase and a downloadable invoice provided by the backend implemented through PDFKit.

<p>Images are from <a href="https://unsplash.com/">unsplash</a> and <a href="https://www.pexels.com/">pexels</a>.</p>
