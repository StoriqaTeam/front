describe('Create store', () => {
  context('when user not authorized', () => {
    it('should redirect to login page', () => {
      cy.visit('/manage/store/new');
      cy.url().should('include', '/login');
    });
  });
});
