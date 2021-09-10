/// <reference types="cypress" />
/* Tests checkout process without calling stripe api */
import { setLoggedIn } from '../../src/features/user/userSlice';
import { create as createOrder, remove as removeOrder } from '../../src/features/order/thunks';
import { OrderStatus } from '../../src/features/order/orderSlice';

const dispatch = (action) => cy.window().its('store').invoke('dispatch', action);

describe('checkout flow', function () {
  let userId: string;
  before(() => {
    cy.register('jauhopussi@gmail.com', 'miukumauku123').then(({ body }) => (userId = body.id));
  });

  after(() => {
    cy.login('jauhopussi@gmail.com', 'miukumauku123').then(function (res) {
      cy.request({
        method: 'DELETE',
        url: `http://localhost:3000/users/${userId}`,
        headers: {
          Authorization: `Bearer ${res.body.accessToken}`,
        },
        form: true,
      }).then((res) => expect(res.status === 200));
    });
  });

  it('fills in checkout forms and order wtihout calling stripe api', function () {
    cy.visit('/');
    cy.location('pathname').should('eq', '/');
    cy.login('jauhopussi@gmail.com', 'miukumauku123')
      .then(function (res) {
        dispatch(
          setLoggedIn({
            loggedIn: true,
            accessToken: res.body.accessToken,
          })
        );
      })
      .then(function () {
        cy.window()
          .its('store')
          .invoke('getState')
          .its('user')
          .its('accessToken')
          .then((token) => {
            cy.request({
              method: 'POST',
              url: 'http://localhost:3000/cart',
              headers: {
                Authorization: `Bearer ${token}`,
              },
              form: true,
            });
          });
      });
    cy.window()
      .its('store')
      .invoke('getState')
      .its('user')
      .as('state:user')
      .its('loggedIn')
      .should('eq', true);
    cy.get('@state:user').its('accessToken').should('not.eq', null);
    cy.window().its('store').invoke('getState').its('cart').should('exist');
    cy.get('.ellipse__button').click();
    cy.location('pathname').should('eq', '/products/bestsellers');
    cy.get('.product-card > button').first().click();
    cy.get('.product-card:nth-child(2) > button').click();
    cy.get('.cart-container__cart-icon__container').click();
    cy.get('.cart-content__checkout > button').first().click({ force: true });
    cy.location('pathname').should('eq', '/cart');
    cy.get('.cart__wrapper__right__ch > button').click();
    cy.location('pathname').should('eq', '/checkout');

    cy.get('input[name="address"]').type('Some Street 5');
    cy.get('input[name="country"]').type('Someland');
    cy.get('input[name="city"]').type('Somecity');
    cy.get('input[name="postalcode"]').type('01000');
    cy.get('[type="submit"]').click();
    cy.get('#stripe').click();
    cy.get('[type="submit"]').click();
    cy.location('pathname').should('eq', '/payment');
    cy.get('@state:user')
      .its('accessToken')
      .then(function () {
        dispatch(
          createOrder({
            total_price: 9.5,
            address: 'Somestreet 5',
            country: 'Someland',
            city: 'Somecity 5',
            postalcode: '01000',
            status: OrderStatus.UNPAID,
          })
        );
      });
    cy.visit('/purchase-confirmed');
    cy.get('@state:user').its('accessToken').should('exist');
    cy.window()
      .its('store')
      .invoke('getState')
      .its('order')
      .its('recentOrder')
      .as('rOrder')
      .then(function (order) {
        dispatch(removeOrder(order.id));
      });
  });
});
