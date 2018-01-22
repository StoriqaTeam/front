import fs from 'fs';
import path from 'path';
import { introspectionQuery } from 'graphql/utilities';
import fetch from 'isomorphic-fetch';
import getClientEnvironment from '../config/env';

// Save JSON of full schema introspection for Babel Relay Plugin to use

const run = () => {
  console.log('Start GraphQL schema update.');
  const graphqlEndpoint = getClientEnvironment('').raw.REACT_APP_SERVER_GRAPHQL_ENDPOINT;
  if (!graphqlEndpoint) {
    console.error(`Please check 'graphqlEndpoint' var in ${__filename}`);
    process.exit(1);
  }
  fetch(graphqlEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: introspectionQuery,
    }),
  })
    .then(result => result.json())
    .then(result => {
      if (result.errors) {
        console.error(
          'ERROR introspecting schema: ',
          JSON.stringify(result.errors, null, 2)
        );
      } else {
        fs.writeFileSync(
          path.join(__dirname, '../src/relay/schema.json'),
          JSON.stringify(result, null, 2)
        );
        console.log('GraphQL schema updated.');
      }
    })
    .catch((err) => {
      console.error(`Error in ${__filename}`);
      console.error(err);
      process.exit(1);
    });
};

run();
