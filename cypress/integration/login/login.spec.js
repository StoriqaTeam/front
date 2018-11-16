/// <reference types="cypress" />

describe('Login page', () => {
  it('exists', () => {
    cy.visit('/login');
    cy.get('[data-test=email]')
      .type('il.ya@sald.in')
      .should('have.value', 'il.ya@sald.in');
    cy.get('[data-test=password]')
      .type('1q2w#E$R')
      .should('have.value', '1q2w#E$R');
    cy.get('[data-test=signInButton]').click();
    cy.url().should('equals', `${Cypress.config('baseUrl')}/`);
  });
});
