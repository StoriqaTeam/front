// @flow strict

import { fetchQuery, graphql } from 'react-relay';
import { Environment } from 'relay-runtime';

const ATTRIBUTES_QUERY = graphql`
  query fetchAttributes_Query {
    attributes {
      id
      rawId
      name {
        lang
        text
      }
    }
  }
`;

const fetchAttributes = (environment: Environment) =>
  fetchQuery(environment, ATTRIBUTES_QUERY);

export default fetchAttributes;
