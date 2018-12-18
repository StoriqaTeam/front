// @flow strict

import { fetchQuery, graphql } from 'react-relay';
import { Environment } from 'relay-runtime';

const AUTOCOMPLETEPRODUCTNAME_QUERY = graphql`
  query fetchAutoCompleteProductName_Query($name: String!) {
    search {
      autoCompleteProductName(name: $name) {
        edges {
          node
        }
      }
    }
  }
`;

const fetchAutoCompleteProductName = (
  environment: Environment,
  variables: {
    name: string,
  },
) => fetchQuery(environment, AUTOCOMPLETEPRODUCTNAME_QUERY, variables);

export default fetchAutoCompleteProductName;
