// @flow

// TODO: rename to UpdateStoreContactsMutation

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';
import type {
  UpdateStoreMutationVariables,
  UpdateStoreMutationResponse,
} from './__generated__/UpdateStoreMutation.graphql';

const mutation = graphql`
  mutation UpdateStoreMutation($input: UpdateStoreInput!) {
    updateStore(input: $input) {
      id
      rawId
      defaultLanguage
      email
      phone
      slug
      logo
      name {
        lang
        text
      }
      shortDescription {
        lang
        text
      }
      addressFull {
        country
        value
        administrativeAreaLevel1
        administrativeAreaLevel2
        locality
        political
        postalCode
        route
        streetNumber
      }
      address
      country
      facebookUrl
      twitterUrl
      instagramUrl
      baseProducts(first: 100) @connection(key: "Wizard_baseProducts") {
        edges {
          node {
            id
          }
        }
      }
    }
  }
`;

export type MutationParamsType = {
  ...UpdateStoreMutationVariables,
  environment: Environment,
  onCompleted: ?(
    response: ?UpdateStoreMutationResponse,
    errors: ?Array<Error>,
  ) => void,
  onError: ?(error: Error) => void,
};

const commit = (params: MutationParamsType) =>
  commitMutation(params.environment, {
    mutation,
    variables: {
      input: params.input,
    },
    onCompleted: params.onCompleted,
    onError: params.onError,
  });

export default { commit };
