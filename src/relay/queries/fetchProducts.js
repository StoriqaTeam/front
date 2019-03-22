// @flow strict

import { fetchQuery, graphql } from 'react-relay';
import { Environment } from 'relay-runtime';
import { reject, isNil } from 'ramda';

import { log } from 'utils';

import type { fetchProducts_QueryResponse as FetchProductsType } from './__generated__/fetchProducts_Query.graphql';

type InputType = {
  ids: Array<number>,
  environment: Environment,
};

type ReturnType = FetchProductsType;

const PRODUCTS = graphql`
  query fetchProducts_Query($input: GetProductsInput!) {
    products(input: $input) {
      id
      rawId
      discount
      photoMain
      cashback
      price
      customerPrice {
        price
        currency
      }
      baseProduct(visibility: "published") {
        rawId
        storeId
        name {
          lang
          text
        }
        store {
          name {
            lang
            text
          }
        }
        currency
        rating
      }
    }
  }
`;

const fetchProducts = (input: InputType): Promise<ReturnType> => {
  log.debug();
  const variables = {
    input: { ids: input.ids },
  };
  return fetchQuery(input.environment, PRODUCTS, variables).then(response => {
    if (response && response.products && response.products instanceof Array) {
      return Promise.resolve(reject(isNil, response.products));
    }

    return Promise.reject(new Error('Unable to fetch packages'));
  });
};

export default fetchProducts;
