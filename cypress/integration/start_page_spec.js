describe('Index page', function() {
  it('exists', function() {
    cy.setCookie('holyshit', 'iamcool');
    cy.visit('/');
  });
});
