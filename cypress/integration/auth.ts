/// <reference types="cypress" />
import { setLoggedIn } from '../../src/features/user/userSlice';

describe('Test authentication flow', function () {
  this.beforeEach(() => {
    /*
    cy.request('POST', 'http://localhost:3000/users', {
      email: 'jauhopussi@gmail.com',
      password: 'miukumauku123',
    });
    */
  });
  it('Sign up and login a user', function () {
    /* This can only be used once I figure out how
     * to set the redux store to set user.loggedIn to true
     * and set user.token to jwt token from the server
    cy.visit('/');
    cy.request('POST', 'http://localhost:3000/auth/signin', {
      email: 'jauhopussi@gmail.com',
      password: 'miukumauku123',
    }).then((res) => {
      localStorage.setItem('user', JSON.stringify(res.body));
    });
    cy.wait(1500);
    cy.reload();
    */

    cy.visit('./register');
    cy.get('input[name="email"]').type('jauhopussi@gmail.com');
    cy.get('input[name="password"]').type('miukumauku123');
    cy.get('button[type="submit"]').click();
    cy.location('pathname').should('eq', '/login');
    cy.get('input[name="email"]').type('jauhopussi@gmail.com');
    cy.get('input[name="password"]').type('miukumauku123');
    cy.get('button[type="submit"]').click();
    cy.location('pathname').should('eq', '/', () => {
      expect(localStorage.getItem('user')).to.not.be.null;
    });
    cy.get('div[class="profile-dropdown"]').click();
  });
});
