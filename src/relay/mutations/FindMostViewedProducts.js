// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

const query = graphql`
  query FindMostViewedProductsQuery {
    mainPage {
      findMostViewedProducts(
        searchTerm: {
          options: {
            attrFilters: [],
            categoriesIds: [1]
          }
        }
      ) {
        edges {
          node {
            id
            rawId
          }
        }
      }
    }
  }
`;

type MutationParamsType = {
  environment: Environment,
  onCompleted: ?(response: ?Object, errors: ?Array<Error>) => void,
  onError: ?(error: Error) => void,
};

const commit = (params: MutationParamsType) => commitMutation(params.environment, {
  query,
  variables: {},
  onCompleted: params.onCompleted,
  onError: params.onError,
});

export default { commit };
