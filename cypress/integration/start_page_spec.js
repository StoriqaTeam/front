describe('Index page', function() {
  beforeEach(() => {
    cy.login('il.ya@sald.in', '1q2w#E$R');
    cy.setCookie('holyshit', 'iamcool');
  });

  it('exists', () => {
    cy.visit('/');
  });
});
