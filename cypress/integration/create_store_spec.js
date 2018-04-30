describe('Create store', () => {
  context('when user not authorized', () => {
    beforeEach(() => {
      cy.visit('/manage/store/new');
    });

    it('should redirect to login page', () => {
      cy.url().should('include', '/login');
    });
    it('should be redirected back after succes login', () => {
      cy.get('input[data-test=email]').type('test@test.test');
      cy.get('input[data-test=password]').type('1q2w#E$R');
      cy.get('button[data-test=signInButton]').click();
      cy.url().should('include', '/manage/store/new');
    });
  });
});
