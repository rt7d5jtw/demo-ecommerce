<p align="center">
  <img src="https://i.imgur.com/SWs77TE.png" width="625" alt="front page" />
</p>

# Chocolate store, Chocolatist, Ecommerce client with React and Redux.

<p>Client with simple user access control, profile- and admin dashboard, and checkout. Does not use additional UI libraries besides React, pagination, "inifinite scrolling pages" through IntersectionObserver API and searching for products have been implemented. IntersectionObserver is also used for the navigation bar to get out of the client's way and also provide some neat "slides" at front page. Users also have ability to change their passwords and emails through "/profile-dashboard" page. Application uses NestJS as the backend that persists to postgresql. Authentication is done through NestJS that implements it through passport library using JWTs. Client has shopping cart implemented through redux. The client is mobile responsive except for the admin dashboard which is responsive only up to tablets.</p>

<br />

<p>Website also has notifications implemented through redux that are used for giving client a "test user", so that anyone can tests the applications features. Client users have also the ability to register to the website through the "/register" page, linked at "/login" page. Notifications also give information for the users about state changes being succesful or not. Payments implemented through Stripe API, only logged in users can use this feature, after succesful payment, user gets information page about their purchase and a downloadable invoice provided by the backend implemented through PDFKit. Application uses lazy loading for Homepage, Registration page, Login page, Admin Dashboard, Profile Dashboard, Checkout and Stripe wrapper pages. Loading page used through React.Suspense that is used with react-persist library's PersistGate that also uses the loading page for state transitions and loading pages. Application uses React's error boundary fallback ui. Admin Dashboard provides a previews for the the constructing products, categories and promotions.</p>

<p>Testing provided through Jest, MSW and Cypress. Jest is used for testing some cart redux selectors, MSW is used for API testing and Cypress for e2e and integration testing.</p>

<br />

## About the form components and handling form authentication

<p>The forms the application uses have been implemented in <code>"/src/features/forms/"</code>. The authentication and authorization pages, or "login" and "register" pages use ProfileForm components that takes submit event handler and "fields" as arguments to construct the forms for the pages. "Fields" is an object that takes in html like attributes in nested order, these are used to provide the necessary information for constructing the pages and providing some of the validation. As an example, "inputs" is used as a key for accessing the input attributes that is provided as an object of key-value pairs with html attributes. The ProfileForm component also provides labels and warnings if they're specified in the fields arguments. These pages also use AuthOverlay component for providing an overlay for the forms. The authentication for the forms is handled through <code>handleForm</code> function that takes in collection of HTML form control elements as an input and parses it through using <code>Array.from</code> and <code>filter</code> methods and then matching inputs based on node names, it also transforms the collection into list of key-value pairs using <code>Object.fromEntries</code> method for the api. ProfileForm component is also used for the Profile Dashboard pages.</p>

<br />

<p>TestForm component is implemented through same idea except that it parses through a list of keys that it uses to match the components it provides and takes in more arguments. These features are used for constructing the the Admin Dashboard and Checkout forms.</p>
<br />
<p>The MultipleSelectForm component in <code>/src/features/forms/testform.tsx</code>, as it uses select element's DOM attributes to construct a "multiple selection" component that let's you choose multiple options and constructs its own internal state. This differs from just having "multiple" attribute set to true in select elemnt in html as this requires the user to hold control or command to select multiple values. This component lets user select and unselect with left click and communicates this to the user by changing the color of the selected option.</p>

<p>These form components are more of a fun exercise.</p>

<br />

<p>Images are from <a href="https://unsplash.com/">unsplash</a> and <a href="https://www.pexels.com/">pexels</a>.</p>
