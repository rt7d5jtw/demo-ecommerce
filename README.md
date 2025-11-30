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

## ⚠️  Node.js Version Warning

This project was developed with older dependencies (React 17, Redux Toolkit 1.x, Webpack 5.x) which were current around **2021-2022**.

**It is strongly recommended to run this project using Node.js version 16 (LTS).**

While the project may still install with newer versions (v18, v20, etc.), you may encounter various issues, including:

* **Installation/Build Errors:** Conflicts with native modules or deprecations in newer Node.js APIs.
* **Dependency Mismatches:** Unexpected runtime issues or warnings due to older peer dependency requirements.

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

*Images are from [unsplash](https://unsplash.com/) and [pexels](https://www.pexels.com/)*

### Forms: about the form components and handling form authentication

<p>The forms the application uses have been implemented in `/src/features/forms/`. The authentication and authorization pages, or "login" and "register" pages use ProfileForm components that takes submit event handler and "fields" as arguments to construct the forms for the pages. "Fields" is an object that takes in html like attributes in nested order, these are used to provide the necessary information for constructing the pages and providing some of the validation. As an example, "inputs" is used as a key for accessing the input attributes that is provided as an object of key-value pairs with html attributes. The ProfileForm component also provides labels and warnings if they're specified in the fields arguments. These pages also use AuthOverlay component for providing an overlay for the forms. The authentication for the forms is handled through `handleForm` function that takes in collection of HTML form control elements as an input and parses it through using `Array.from` and `filter` methods and then matching inputs based on node names, it also transforms the collection into list of key-value pairs using `Object.fromEntries` method for the api. ProfileForm component is also used for the Profile Dashboard pages.</p>

<p>TestForm component is implemented through same idea except that it parses through a list of keys that it uses to match the components it provides and takes in more arguments. These features are used for constructing the the Admin Dashboard and Checkout forms.</p>

<p>The MultipleSelectForm component in `/src/features/forms/testform.tsx`, as it uses select element's DOM attributes to construct a "multiple selection" component that let's you choose multiple options and constructs its own internal state. This differs from just having "multiple" attribute set to true in select elemnt in html as this requires the user to hold control or command to select multiple values. This component lets user select and unselect with left click and communicates this to the user by changing the color of the selected option.</p>

<p>These form components are more of a fun exercise rather than something serious.</p>
