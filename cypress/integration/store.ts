/// <reference types="cypress" />
/* test search, sidebar, frontpage links, single product page and category pages */
describe('Test overall website functionality', function () {
  it('Search component testing', function () {
    cy.visit('/');
    cy.location('pathname').should('eq', '/');
    cy.get('#searchInput').type('milk chocolate');
    cy.get('.search__suggestions').within(() => {
      cy.get('button').first().click();
    });
    cy.window()
      .its('store')
      .invoke('getState')
      .its('cart')
      .as('state:cart')
      .its('items')
      .as('cartItems')
      .its('length')
      .should('eq', 1);
    cy.get('.cart-container__cart-icon__container').as('cart').click();
    cy.get('.cart-item__remove-btn').as('cart-remove').click();
    cy.get('@state:cart');

    cy.get('#searchInput').clear().type('dark chocolate');
    cy.get('.search__suggestions').within(() => {
      cy.get('.search__suggestions__product-info').first().click();
    });
    cy.get('.single-product__col-2__footer').within(() => {
      cy.get('button').click();
    });
    cy.url().should('include', '/products/bestsellers/');
    cy.get('@cart').click();
    cy.get('@cart-remove').click();

    cy.get('.close-btn-closed > path').as('menu').click();
    cy.get('[href="/products/bestsellers"]').click();
    cy.location('pathname').should('eq', '/products/bestsellers');
    cy.scrollTo('bottom');
    cy.get(':nth-child(27) > .product-card__card-button').click();
    cy.visit('/products/shopall');
    cy.scrollTo('bottom', { duration: 500 });
    cy.scrollTo('bottom', { duration: 500 });
    cy.get('@menu').click();
    cy.get('[href="/products/Milk Chocolate"]').click();
    cy.location('pathname').should('eq', '/products/Milk%20Chocolate');
    cy.scrollTo('bottom', { duration: 500 });
    cy.get('@menu').click();
    cy.get('[href="/products/Dark Chocolate"]').click();
    cy.location('pathname').should('eq', '/products/Dark%20Chocolate');
    cy.scrollTo('bottom', { duration: 500 });
    cy.get('@menu').click();
    cy.get('[href="/products/White Chocolate"]').click();
    cy.location('pathname').should('eq', '/products/White%20Chocolate');
    cy.scrollTo('bottom', { duration: 500 });
    cy.get('@menu').click();

    cy.get('.logo-link > h1').click({ force: true });
    cy.location('pathname').should('eq', '/');
    cy.scrollTo('center', { duration: 500 });
    cy.get(':nth-child(1) > .promotion-card__p').click();
    cy.location('pathname').should('eq', '/products/Milk%20Chocolate');
    cy.go('back');
    cy.scrollTo('center', { duration: 500 });
    cy.get(':nth-child(2) > .promotion-card__p').click();
    cy.location('pathname').should('eq', '/products/Dark%20Chocolate');
    cy.go('back');
    cy.scrollTo('center', { duration: 500 });
    cy.get(':nth-child(3) > .promotion-card__p').click();
    cy.location('pathname').should('eq', '/products/White%20Chocolate');
  });
});
