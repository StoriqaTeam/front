// @flow strict

import { fetchQuery, graphql } from 'react-relay';
import { Environment } from 'relay-runtime';

const AUTOCOMPLETE_STORE_NAME_QUERY = graphql`
  query fetchAutoCompleteStoreName_Query($name: String!) {
    search {
      autoCompleteStoreName(name: $name) {
        edges {
          node
        }
      }
    }
  }
`;

const fetchAutoCompleteStoreName = (
  environment: Environment,
  variables: {
    name: string,
  },
) => fetchQuery(environment, AUTOCOMPLETE_STORE_NAME_QUERY, variables);

export default fetchAutoCompleteStoreName;
