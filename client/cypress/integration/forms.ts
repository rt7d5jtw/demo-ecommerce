/// <reference types="cypress" />
/* For Admin Dashboard test to work make sure you have the required asset(s)! */
import { AnyAction } from 'redux';
import { setLoggedIn, setRole } from '../../src/features/user/userSlice';

describe('Are profile and admin forms working', function () {
  let userId: string;
  const dispatch = (action: AnyAction) => cy.window().its('store').invoke('dispatch', action);

  this.beforeEach(() => {
    //cy.window().then(window => window.localStorage.clear());
    cy.request('POST', 'http://localhost:3000/users', {
      email: 'jauhopussi@gmail.com',
      password: 'miukumauku123',
    }).then((res) => {
      userId = res.body.id;
    });
  });

  /*
  it('profile dashboard forms', function () {
    cy.intercept('GET', '/category').as('categories');
    cy.visit('/');
    cy.wait('@categories').then((interception) => {
      expect(interception.response.statusCode).to.be.oneOf([200, 304]);
      expect(interception.response.body).exist;
    });
    cy.login('jauhopussi@gmail.com', 'miukumauku123').then(function (res) {
      dispatch(
        setLoggedIn({
          loggedIn: true,
          accessToken: res.body.accessToken,
        })
      );
    });
    cy.location('pathname').should('eq', '/');
    cy.window().its('store').invoke('getState').its('user').its('accessToken').should('exist');
    cy.window()
      .its('store')
      .invoke('getState')
      .its('user')
      .as('state:user')
      .its('loggedIn')
      .should('eq', true);
    cy.visit('/profile/change-password', { log: true });
    cy.location('pathname');

    cy.intercept('PATCH', '/users/changepw').as('changepw');
    cy.get('input[name="currentPassword"]').type('miukumauku123');
    cy.get('input[name="newPassword"]').type('miukumauku1234');
    cy.get('button[type="submit"]').click();
    cy.wait('@changepw').then((interception) => {
      expect(interception.request.body).to.have.property('currentPassword', 'miukumauku123');
      expect(interception.request.body).to.have.property('newPassword', 'miukumauku1234');
      expect(interception.response.statusCode).eq(200);
      expect(interception.response.body).exist;
    });

    cy.visit('./profile/change-email');
    cy.location('pathname').should('eq', '/profile/change-email');
    cy.intercept('PATCH', '/users/email').as('changeEmail');
    cy.get('input[name="currentEmail"]').type('jauhopussi@gmail.com');
    cy.get('input[name="newEmail"]').type('jaahas@gmail.com');
    cy.get('button[type="submit"]').click();
    cy.wait('@changeEmail').then((interception) => {
      expect(interception.request.body).to.have.property('currentEmail', 'jauhopussi@gmail.com');
      expect(interception.request.body).to.have.property('newEmail', 'jaahas@gmail.com');
      expect(interception.response.statusCode).eq(200);
      expect(interception.response.body).exist;
    });

    cy.visit('/');
    cy.clearLocalStorage().then(function () {
      cy.reload().then(function () {
        cy.window()
          .its('store')
          .invoke('getState')
          .its('user')
          .as('state:user')
          .its('loggedIn')
          .should('eq', false);
      });
    });

    cy.intercept('POST', '/auth/signin').as('logggingIn');
    cy.visit('/login');
    cy.location('pathname').should('eq', '/login');
    cy.get('input[name="email"]').type('jaahas@gmail.com');
    cy.get('input[name="password"]').type('miukumauku1234');
    cy.get('button[type="submit"]').click();
    cy.wait('@logggingIn').then((interception) => {
      expect(interception.request.body).exist;
      expect(interception.response.statusCode).eq(201);
      expect(interception.response.body).exist;
    });

    cy.location('pathname').should('eq', '/');
    expect(cy.window().its('store').invoke('getState').its('user').its('accessToken')).exist;
    cy.window()
      .its('store')
      .invoke('getState')
      .its('user')
      .its('accessToken')
      .then((res) => {
        cy.request({
          method: 'DELETE',
          url: `http://localhost:3000/users/${userId}`,
          form: true,
          headers: {
            Authorization: `Bearer ${res}`,
          },
        });
      });
  });
  */

  it('admin dashboard forms', function () {
    cy.visit('/');
    cy.login('jauhopussi@gmail.com', 'miukumauku123').then(function (res) {
      dispatch(
        setLoggedIn({
          loggedIn: true,
          accessToken: res.body.accessToken,
        })
      );
    });
    cy.location('pathname').should('eq', '/');
    cy.window()
      .its('store')
      .invoke('getState')
      .its('user')
      .as('state:user')
      .its('loggedIn')
      .should('eq', true);

    cy.get('@state:user').its('accessToken').as('jwtToken').should('not.eq', null);
    cy.get('@jwtToken').then((token) => {
      cy.request({
        method: 'PATCH',
        url: `http://localhost:3000/users/${userId}/role`,
        form: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: { role: 'ADMIN' },
      }).then((res) => {
        expect(res.status).eq(200);
        expect(res.body).eq('ADMIN');
        dispatch(setRole({ role: res.body }));
      });
    });
    cy.window()
      .its('store')
      .invoke('getState')
      .its('user')
      .as('state:user')
      .its('role')
      .should('eq', 'ADMIN');
    cy.visit('/admin-dashboard/products-dashboard');
    cy.location('pathname').should('eq', '/admin-dashboard/products-dashboard');
    cy.get('#new-product').click();

    cy.intercept('POST', '/product').as('createProduct');
    cy.location('pathname').should('eq', '/admin-dashboard/products-dashboard/create');
    cy.get('input[name="title"]').type('TestProduct');
    cy.get('input[name="price"]').type('15');
    cy.get('textarea[name="description"]').type('This is a test');
    cy.fixture('ni.jpg').as('pic');
    cy.get('input[type=file]').then(function (el) {
      const blob = Cypress.Blob.base64StringToBlob(this.pic, 'ni.jpg');
      const file = new File([blob], 'ni.jpg', { type: 'image/jpeg' });
      const list = new DataTransfer();

      list.items.add(file);
      const myFileList = list.files;
      el[0].files = myFileList;
      el[0].dispatchEvent(new Event('change', { bubbles: true }));
    });
    cy.get('.multiple-select').click();
    cy.get('[data-cy=option-bestsellers]').click();
    cy.get('#badumts-form').submit();
    cy.wait('@createProduct').then((interception) => {
      expect(interception.response.statusCode).eq(201);
      expect(interception.response.body).exist;
    });
    cy.get('#back-to-products').click();
    cy.location('pathname').should('eq', '/admin-dashboard/products-dashboard');
    cy.get('input[name=search]').as('search').type('TestProduct');
    cy.intercept({ method: '+(PUT|PATCH)', url: /^\/product\/(\d+)$/ }).as('updateProduct');
    cy.get(':first-child > :nth-child(8) > #edit-link').click();
    cy.location('pathname').should(
      'match',
      /^\/admin-dashboard\/products-dashboard\/edit\/(\d+)$/gi
    );
    cy.get('input[type=file]').then(function (el) {
      const blob = Cypress.Blob.base64StringToBlob(this.pic, 'ni.jpg');
      const file = new File([blob], 'ni.jpg', { type: 'image/jpeg' });
      const list = new DataTransfer();

      list.items.add(file);
      const myFileList = list.files;
      el[0].files = myFileList;
      el[0].dispatchEvent(new Event('change', { bubbles: true }));
    });
    cy.get('input[name="title"]').clear().type('ChangedTestProduct');
    cy.get('#badumts-form').submit();
    cy.wait('@updateProduct').then((interception) => {
      expect(interception.response.statusCode).eq(200);
      expect(interception.response.body).exist;
    });
    cy.get('#back-to-products').click();
    cy.location('pathname').should('eq', '/admin-dashboard/products-dashboard');
    cy.get('@search').type('ChangedTestProduct');
    cy.get(':first-child > :nth-child(9) > #delete-row').click();
    cy.on('window:confirm', () => true);
    cy.get(':nth-child(2) > a').click();

    cy.get('#new-category').click();
    cy.intercept({ method: 'POST', url: '/category' }).as('createCategory');
    cy.location('pathname').should('eq', '/admin-dashboard/categories-dashboard/categories-create');
    cy.get('input[name="cname"]').type('Testing');
    cy.get('#badumts-form').submit();
    cy.get('#back-to-categories').click();
    cy.get(':last-child > :nth-child(4) > #edit-link').click();
    cy.get('input[name="title"]').clear().type('ChangedTesting');
    cy.get('#badumts-form').submit();
    cy.wait('@createCategory').then((interception) => {
      expect(interception.response.statusCode).eq(201);
      expect(interception.response.body).exist;
    });

    cy.get('#back-to-categories').click();
    cy.get(':last-child > :nth-child(5) > #delete-row').click();
    cy.on('window:confirm', () => true);

    cy.get(':nth-child(3) > a').click();
    cy.get('#new-promotion').click();
    cy.intercept({ method: 'POST', url: '/promotions' }).as('createPromotion');
    cy.location('pathname').should('eq', '/admin-dashboard/promotions-dashboard/promotions-create');
    cy.get('input[name="title"]').type('Testing');
    cy.get('#url').type('Testing');
    cy.get('input[type=file]').then(function (el) {
      const blob = Cypress.Blob.base64StringToBlob(this.pic, 'ni.jpg');
      const file = new File([blob], 'ni.jpg', { type: 'image/jpeg' });
      const list = new DataTransfer();

      list.items.add(file);
      const myFileList = list.files;
      el[0].files = myFileList;
      el[0].dispatchEvent(new Event('change', { bubbles: true }));
    });
    cy.get('#badumts-form').submit();
    cy.wait('@createPromotion').then((interception) => {
      expect(interception.response.statusCode).eq(201);
      expect(interception.response.body).exist;
    });
    cy.get('#back-to-promotions').click();

    cy.location('pathname').should('eq', '/admin-dashboard/promotions-dashboard');
    cy.intercept({ method: '+(PUT|PATCH)', url: /^\/promotions\/(\d+)$/ }).as('updatePromotion');
    cy.get(':last-child > :nth-child(5) > #edit-link').click();
    cy.get('input[type=file]').then(function (el) {
      const blob = Cypress.Blob.base64StringToBlob(this.pic, 'ni.jpg');
      const file = new File([blob], 'ni.jpg', { type: 'image/jpeg' });
      const list = new DataTransfer();

      list.items.add(file);
      const myFileList = list.files;
      el[0].files = myFileList;
      el[0].dispatchEvent(new Event('change', { bubbles: true }));
    });
    cy.get('input[name="title"]').clear().type('ChangedTesting');
    cy.get('#badumts-form').submit();
    cy.wait('@updatePromotion').then((interception) => {
      expect(interception.response.statusCode).eq(200);
      expect(interception.response.body).exist;
    });

    cy.get('#back-to-promotions').click();
    cy.get(':last-child > :nth-child(6) > #delete-row').click();
    cy.on('window:confirm', () => true);

    cy.get('#orders').click();
    cy.get('#users').click();
    cy.get('@state:user')
      .its('accessToken')
      .as('authToken')
      .should('not.eq', null)
      .then(function (res) {
        cy.request({
          method: 'DELETE',
          url: `http://localhost:3000/users/${userId}`,
          headers: {
            Authorization: `Bearer ${res}`,
          },
          form: true,
        }).then((res) => expect(res.status === 200));
      });
  });
});
