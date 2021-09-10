/// <reference types="cypress" />
import { AnyAction } from 'redux';
import { setLoggedIn } from '../../src/features/user/userSlice';

describe('Test authentication and authorization flow', function () {
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

  it('Sign up and login a user', function () {
    cy.visit('/');
    cy.location('pathname').should('eq', '/');
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/auth/signin',
      form: true,
      body: {
        email: 'jauhopussi@gmail.com',
        password: 'miukumauku123',
      },
    }).then(function (res) {
      dispatch(setLoggedIn({ loggedIn: true, accessToken: res.body.accessToken }));
    });
    cy.window()
      .its('store')
      .invoke('getState')
      .its('user')
      .as('state:user')
      .its('loggedIn')
      .should('eq', true);
    cy.get('@state:user').its('accessToken');
    cy.get('@state:user')
      .its('accessToken')
      .should('not.eq', null)
      .then(function (token) {
        cy.request({
          method: 'DELETE',
          url: `http://localhost:3000/users/${userId}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          form: true,
        }).then((res) => expect(res.status === 200));
      });
  });
});
