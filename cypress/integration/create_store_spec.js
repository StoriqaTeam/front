const authorizedUserJWT = 'authorized_user_token';

describe('Create store', () => {
  context('when user not authorized', () => {
    beforeEach(() => {
      cy.clearCookie('__jwt');
      cy.visit('/manage/store/new');
    });

    it('should redirect to login page', () => {
      cy.url().should('include', '/login');
    });
    it('should be redirected back after succes login', () => {
      cy.get('input[data-test=email]').type('test@test.test');
      cy.get('input[data-test=password]').type('1q2w#E$R');
      cy.get('button[data-test=signInButton]').click();
      cy.url().should('eq', 'https://localhost:3443/manage/store/new');
    });
  });

  context('when user authorized', () => {
    const fields = ['name', 'slug', 'shortDescription', 'longDescription'];
    beforeEach(() => {
      cy.setCookie('__jwt', `%7B%22value%22%3A%22${authorizedUserJWT}%22%7D`);
      cy.visit('/manage/store/new');
    });

    it('page should exists', () => {
      cy.url().should('eq', 'https://localhost:3443/manage/store/new');
    });

    it('should display errors when no entered data and press save', () => {
      cy.get('button[data-test=saveButton]').click();
      fields.forEach(item => {
        cy
          .get(`div#error-label-${item}`)
          .should('be.visible')
          .and('contain', 'Should not be empty');
      });
    });
  });
});
