/// <reference types="cypress" />

Cypress.Commands.add('login', (login, password) => {
  cy
    .request({
      method: 'POST',
      url: Cypress.env('graphql'),
      headers: { 'Content-Type': 'application/json', Currency: 'STQ' },
      body: {
        query:
          'mutation LoginMutation($input: CreateJWTEmailInput!) {getJWTByEmail(input: $input) {token}}',
        variables: {
          input: {
            clientMutationId: '',
            email: login,
            password,
          },
        },
      },
    })
    .its('body.data.getJWTByEmail.token')
    .then(token => {
      cy.setCookie('__jwt', encodeURIComponent(`{"value":"${token}"}`));
    });
});

Cypress.Commands.overwrite('visit', (originalFn, url, options) => {
  cy.setCookie('holyshit', 'iamcool').then(() => {
    originalFn(url, options);
  });
});
