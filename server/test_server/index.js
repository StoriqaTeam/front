/* eslint-disable */

import express from 'express';
import { buildClientSchema } from 'graphql';
import {
  addMockFunctionsToSchema,
  addResolveFunctionsToSchema,
} from 'graphql-tools';
import { graphqlExpress } from 'apollo-server-express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { data as schemaJSON } from '../../src/relay/schema.json';

const schema = buildClientSchema(schemaJSON);

addMockFunctionsToSchema({
  schema,
  preserveResolvers: true,
});

addResolveFunctionsToSchema({
  schema,
  resolvers: {
    Query: {
      me: (_, __, context, ___) => {
        return context.loggedIn
          ? { id: 'uhuuhuhuu-uuuhuuu-12', email: 'test@test.test' }
          : null;
      },
    },
  },
});

const PORT = process.env.PORT || 3004;

const app = express();

app.use(cors()).use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress(() => ({
    schema,
    context: {
      loggedIn: !!process.env.LOGGED_IN,
    },
  })),
);

app.listen(PORT, () => console.log(`Started on port ${PORT}`));

/* eslint-enable */
