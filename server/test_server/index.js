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
import fs from 'fs';
import path from 'path';
import https from 'https';

import findMostViewedProducts from './findMostViewed';
import categories from './categories';

import { data as schemaJSON } from '../../src/relay/schema.json';

const certOptions = {
  key: fs.readFileSync(path.resolve(__dirname + './../cert/server.key')),
  cert: fs.readFileSync(path.resolve(__dirname + './../cert/server.crt')),
};

const schema = buildClientSchema(schemaJSON);

const authorizedUserJWT = 'authorized_user_token';

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
      mainPage: (_, __, context, ___) => ({
        findMostViewedProducts,
        findMostDiscountProducts: findMostViewedProducts,
      }),
      currencies: () => [{ rawId: 1, key: 1, name: 'STQ' }],
      categories: () => ({ ...categories }),
    },
    Mutation: {
      getJWTByEmail: (_, { input: { email, password } }, __) => {
        if (email === 'test@test.test' && password === '1q2w#E$R') {
          return Promise.resolve().then(() => ({
            token: authorizedUserJWT,
          }));
        } else {
          return Promise.reject(
            // разобраться как правильно возвращать ошибки
            JSON.stringify({
              email: [
                { code: 'email', message: 'Email not found', params: {} },
              ],
            }),
          );
        }
      },
    },
  },
});

const PORT = process.env.PORT || 3004;

const app = express();

app.use(cors()).use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress(req => {
    return {
      schema,
      context: {
        loggedIn: req.headers.authorization === `Bearer ${authorizedUserJWT}`,
      },
    };
  }),
);

https.createServer(certOptions, app).listen(PORT, '0.0.0.0', () => {
  console.log(`App listening for https on port ${PORT}!`);
});

process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', err => {
    console.error(err, 'Uncaught Exception thrown');
    process.exit(1);
  });

/* eslint-enable */
