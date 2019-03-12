// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

import type {
  CreateStoreMutationVariables,
  CreateStoreMutationResponse,
} from './__generated__/CreateStoreMutation.graphql';

const mutation = graphql`
  mutation CreateStoreMutation($input: CreateStoreInput!) {
    createStore(input: $input) {
      id
      rawId
      name {
        lang
        text
      }
      shortDescription {
        lang
        text
      }
      longDescription {
        lang
        text
      }
      slug
      defaultLanguage
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
  ...CreateStoreMutationVariables,
  environment: Environment,
  onCompleted: ?(
    response: ?CreateStoreMutationResponse,
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
    updater: relayStore => {
      const store = relayStore.getRootField('createStore');
      const me = relayStore.getRoot().getLinkedRecord('me');
      me.setLinkedRecord(store, 'myStore');
    },
  });

export default { commit };
