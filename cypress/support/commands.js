/// <reference types="cypress" />
import { setLoggedIn } from '../../src/features/user/userSlice';

const dispatch = (action) => cy.window().its('store').invoke('dispatch', action);

Cypress.Commands.add('register', (email, pw) => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:3000/users',
    form: true,
    body: {
      email: email,
      password: pw,
    },
  });
});

Cypress.Commands.add('login', (email, pw) => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:3000/auth/signin',
    form: true,
    body: {
      email: email,
      password: pw,
    },
  }).then((res) => {
    localStorage.setItem('user', JSON.stringify(res.body));
  });
});
