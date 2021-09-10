/// <reference types="cypress" />
/* For Admin Dashboard test to work make sure you have the required asset(s)! */
import { AnyAction } from 'redux';
import { setLoggedIn } from '../../src/features/user/userSlice';

describe('Are profile and admin forms working', function () {
  let userId: string;
  const dispatch = (action: AnyAction) => cy.window().its('store').invoke('dispatch', action);

  this.beforeEach(() => {
    cy.request('POST', 'http://localhost:3000/users', {
      email: 'jauhopussi@gmail.com',
      password: 'miukumauku123',
    }).then((res) => {
      userId = res.body.id;
    });
  });

  it('profile dashboard forms', function () {
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
    cy.window().its('store').invoke('getState').should('exist');
    cy.window()
      .its('store')
      .invoke('getState')
      .its('user')
      .as('state:user')
      .its('loggedIn')
      .should('eq', true);
    cy.visit('/profile/change-password');
    cy.location('pathname').should('eq', '/profile/change-password');

    cy.intercept('POST', '/users/changepw', (req) => {
      expect(req.body).to.include('currentPassword=miukumauku123&newPassword=miukumauku1234');
    });

    cy.get('input[name="currentPassword"]').type('miukumauku123');
    cy.get('input[name="newPassword"]').type('miukumauku1234');
    cy.get('button[type="submit"]').click();

    cy.intercept('POST', '/users/email', (req) => {
      expect(req.body).to.include('currentEmail=jauhopussi@gmail.com&newEmail=jaahas@gmail.com');
    });

    cy.visit('./profile/change-email');
    cy.location('pathname').should('eq', '/profile/change-email');
    cy.get('input[name="currentEmail"]').type('jauhopussi@gmail.com');
    cy.get('input[name="newEmail"]').type('jaahas@gmail.com');
    cy.get('button[type="submit"]').click();
    cy.visit('/');
    cy.clearLocalStorage('persist:user').then(function () {
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

    cy.visit('/login');
    cy.location('pathname').should('eq', '/login');
    cy.get('input[name="email"]').type('jaahas@gmail.com');
    cy.get('input[name="password"]').type('miukumauku1234');
    cy.get('button[type="submit"]').click();
    cy.location('pathname')
      .should('eq', '/', () => {
        expect(cy.get('state:user').its('accessToken').as('authToken')).to.not.be.null;
      })
      .then(function () {
        cy.request({
          method: 'DELETE',
          url: `http://localhost:3000/users/${userId}`,
          headers: {
            Authorization: `Bearer ${cy.get('@authToken')}`,
          },
          form: true,
        }).then((res) => expect(res.status === 200));
      });
  });

  /*
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
    cy.get('@state:user').its('accessToken').should('not.eq', null);
    cy.visit('./admin-dashboard/products-dashboard');
    cy.get('#new-product').click();
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
    cy.get('#back-to-products').click();
    cy.location('pathname').should('eq', '/admin-dashboard/products-dashboard');
    cy.get('input[name=search]').as('search').type('TestProduct');
    cy.get(':first-child > :nth-child(8) > #edit-link').click();
    //cy.location('pathname').should('eq', '/admin-dashboard/products-dashboard/edit/40');
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
    cy.get('#back-to-products').click();
    cy.location('pathname').should('eq', '/admin-dashboard/products-dashboard');
    cy.get('@search').type('ChangedTestProduct');
    cy.get(':first-child > :nth-child(9) > #delete-row').click();
    cy.on('window:confirm', () => true);

    cy.get(':nth-child(2) > a').click();
    cy.get('#new-category').click();
    cy.location('pathname').should('eq', '/admin-dashboard/categories-dashboard/categories-create');
    cy.get('input[name="cname"]').type('Testing');
    cy.get('#badumts-form').submit();
    cy.get('#back-to-categories').click();
    cy.get(':last-child > :nth-child(4) > #edit-link').click();
    cy.get('input[name="title"]').clear().type('ChangedTesting');
    cy.get('#badumts-form').submit();
    cy.get('#back-to-categories').click();
    cy.get(':last-child > :nth-child(5) > #delete-row').click();
    cy.on('window:confirm', () => true);

    cy.get(':nth-child(3) > a').click();
    cy.get('#new-promotion').click();
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
    cy.get('#back-to-promotions').click();
    cy.location('pathname').should('eq', '/admin-dashboard/promotions-dashboard');
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
    cy.get('#back-to-promotions').click();
    cy.get(':last-child > :nth-child(6) > #delete-row').click();
    cy.on('window:confirm', () => true);

    cy.get('#orders').click();
    cy.wait(1000);
    cy.get('#users').click();
    cy.wait(1000);
    cy.get('@state:user')
      .its('accessToken').as('authToken')
      .should('not.eq', null)
      .then(function () {
        cy.request({
          method: 'DELETE',
          url: `http://localhost:3000/users/${userId}`,
          headers: {
            Authorization: `Bearer ${cy.get('@authToken')}`,
          },
          form: true,
        }).then((res) => expect(res.status === 200));
      });
  });
  */
});
