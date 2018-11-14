// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('login', (login, password) => {
  cy
    .request({
      method: 'POST',
      url: 'https://nightly.stq.cloud/graphql',
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
    .then(({ body }) => {
      cy.setCookie(
        '__jwt',
        encodeURIComponent(`{"value":"${body.data.getJWTByEmail.token}"}`),
        {
          domain: 'nightly.stq.cloud',
          expiry: 2173336185,
        },
      );
    });
});
