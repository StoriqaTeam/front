import fs from 'fs';
import path from 'path';
import { introspectionQuery } from 'graphql/utilities';
import axios from 'axios';
import getClientEnvironment from '../config/env';

// Save JSON of full schema introspection for Babel Relay Plugin to use

const run = () => {
  console.log('Start GraphQL schema update.');
  const graphqlEndpoint = process.env.REACT_APP_SERVER_GRAPHQL_ENDPOINT;
  console.log('GraphQL endpoint: ', graphqlEndpoint);
  if (!graphqlEndpoint) {
    console.error(`Please check 'graphqlEndpoint' var in ${__filename}`);
    process.exit(1);
  }
  axios({
    url: graphqlEndpoint,
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({
      query: introspectionQuery,
    }),
  })
    .then(result => {
      console.log('Result status from graphql: ', result.statusText);
      return result.data;
    })
    .then(result => {
      if (result.errors) {
        console.error(
          'ERROR introspecting schema: ',
          JSON.stringify(result.errors, null, 2),
        );
      } else {
        fs.writeFileSync(
          path.join(__dirname, '../src/relay/schema.json'),
          JSON.stringify(result, null, 2),
        );
        console.log('GraphQL schema updated.');
      }
    })
    .catch(err => {
      console.error(`Error in ${__filename}`);
      console.error(err);
      process.exit(1);
    });
};

run();
