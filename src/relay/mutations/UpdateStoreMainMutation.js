// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

import type {
  UpdateStoreMainMutationVariables,
  UpdateStoreMainMutationResponse,
} from './__generated__/UpdateStoreMainMutation.graphql';

const mutation = graphql`
  mutation UpdateStoreMainMutation($input: UpdateStoreInput!) {
    updateStore(input: $input) {
      id
      name {
        lang
        text
      }
      longDescription {
        lang
        text
      }
      shortDescription {
        lang
        text
      }
      defaultLanguage
      slug
      slogan
      logo
    }
  }
`;

export type MutationParamsType = {
  ...UpdateStoreMainMutationVariables,
  environment: Environment,
  onCompleted: ?(
    response: ?UpdateStoreMainMutationResponse,
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
      const updateStore = relayStore.getRootField('updateStore');
      const logo = updateStore.getValue('logo');
      const storeId = updateStore.getValue('id');
      const store = relayStore.get(storeId);
      store.setValue(logo, 'logo');
    },
  });

export default { commit };
