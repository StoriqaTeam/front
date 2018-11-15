/// <reference types="cypress" />

describe('Login page', () => {
  it('exists', () => {
    cy.setCookie('holyshit', 'iamcool');
    cy.visit('/login');
    cy.get;
  });
});
