// @flow

import { fetchQuery, graphql } from 'react-relay';
import { Environment } from 'relay-runtime';

const STORE_SLUG_EXISTS_QUERY = graphql`
  query fetchStoreSlugExists_Query($slug: String!) {
    storeSlugExists(slug: $slug)
  }
`;

const fetchStoreSlugExists = (
  environment: Environment,
  variables: {
    slug: string,
  },
) => fetchQuery(environment, STORE_SLUG_EXISTS_QUERY, variables);

export default fetchStoreSlugExists;
