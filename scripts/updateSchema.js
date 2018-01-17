import fs from 'fs';
import path from 'path';
import { introspectionQuery } from 'graphql/utilities';
import fetch from 'isomorphic-fetch';

// Save JSON of full schema introspection for Babel Relay Plugin to use

const run = () => {
  fetch('http://localhost:8000/graphql', {
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
        // fs.writeFileSync(
        //   path.join(__dirname, '../schema.graphql'),
        //   printSchema(result)
        // );
      }
    })
    .catch(err => console.error(err));
};

run();