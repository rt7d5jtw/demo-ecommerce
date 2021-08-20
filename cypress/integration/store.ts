/// <reference types="cypress" />

describe('Test searchbar functionality', function () {
  it('Search component testing', function () {
    cy.visit('/');
    cy.get('#searchInput').type('milk chocolate');
    cy.get('.search_suggestions').within(() => {
      cy.get('button').first().click();
    });
  });
});
