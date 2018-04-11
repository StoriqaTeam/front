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
  const patchedIntrospectionQuery = 'query IntrospectionQuery {\n' +
    '    __schema {\n' +
    '      queryType { name }\n' +
    '      mutationType { name }\n' +
    '      subscriptionType { name }\n' +
    '      types {\n' +
    '        ...FullType\n' +
    '      }\n' +
    '      directives {\n' +
    '        name\n' +
    '        description\n' +
    '        locations\n' +
    '        args {\n' +
    '          ...InputValue\n' +
    '        }\n' +
    '      }\n' +
    '    }\n' +
    '  }\n' +
    '\n' +
    '  fragment FullType on __Type {\n' +
    '    kind\n' +
    '    name\n' +
    '    description\n' +
    '    fields(includeDeprecated: true) {\n' +
    '      name\n' +
    '      description\n' +
    '      args {\n' +
    '        ...InputValue\n' +
    '      }\n' +
    '      type {\n' +
    '        ...TypeRef\n' +
    '      }\n' +
    '      isDeprecated\n' +
    '      deprecationReason\n' +
    '    }\n' +
    '    inputFields {\n' +
    '      ...InputValue\n' +
    '    }\n' +
    '    interfaces {\n' +
    '      ...TypeRef\n' +
    '    }\n' +
    '    enumValues(includeDeprecated: true) {\n' +
    '      name\n' +
    '      description\n' +
    '      isDeprecated\n' +
    '      deprecationReason\n' +
    '    }\n' +
    '    possibleTypes {\n' +
    '      ...TypeRef\n' +
    '    }\n' +
    '  }\n' +
    '\n' +
    '  fragment InputValue on __InputValue {\n' +
    '    name\n' +
    '    description\n' +
    '    type { ...TypeRef }\n' +
    '    defaultValue\n' +
    '  }\n' +
    '\n' +
    '  fragment TypeRef on __Type {\n' +
    '    kind\n' +
    '    name\n' +
    '    ofType {\n' +
    '      kind\n' +
    '      name\n' +
    '      ofType {\n' +
    '        kind\n' +
    '        name\n' +
    '        ofType {\n' +
    '          kind\n' +
    '          name\n' +
    '          ofType {\n' +
    '            kind\n' +
    '            name\n' +
    '            ofType {\n' +
    '              kind\n' +
    '              name\n' +
    '              ofType {\n' +
    '                kind\n' +
    '                name\n' +
    '                ofType {\n' +
    '                  kind\n' +
    '                  name\n' +
    '                  ofType {\n' +
    '                    kind\n' +
    '                    name\n' +
    '                    ofType {\n' +
    '                      kind\n' +
    '                      name\n' +
    '                    }\n' +
    '                  }\n' +
    '                }\n' +
    '              }\n' +
    '            }\n' +
    '          }\n' +
    '        }\n' +
    '      }\n' +
    '    }\n' +
    '  }';
  fetch(graphqlEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: patchedIntrospectionQuery,
    }),
  })
    .then(result => {
      console.log('Result status from graphql: ', result.statusText);
      return result.json();
    })
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
