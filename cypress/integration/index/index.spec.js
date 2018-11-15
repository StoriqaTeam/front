/// <reference types="Cypress" />

describe('Index page', function() {
  beforeEach(() => {
    cy.setCookie('holyshit', 'iamcool');
  });

  context('Not logged in', () => {
    beforeEach(() => {
      cy.visit('/');
    });

    it('has cart button in header', () => {
      cy.get('[data-test=header-cart-button]');
    });
  });

  context('Logged in', () => {
    beforeEach(() => {
      cy.login('il.ya@sald.in', '1q2w#E$R');
      cy.visit('/');
    });

    it('should has dropdown for logged in user in header', () => {
      cy.get('[data-test=userDropdownButton]').should('exist');
    });
  });
});
