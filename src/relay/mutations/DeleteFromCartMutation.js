// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

import type { DeleteFromCartMutationVariables, DeleteFromCartMutationResponse } from './__generated__/IncrementInCartMutation.graphql';

const mutation = graphql`
  mutation DeleteFromCartMutation($input: DeleteFromCartInput!) {
    deleteFromCart(input: $input) {
      productId,
      storeId,
    }
  }
`;


export type DeleteFromCartParams = {
  ...DeleteFromCartMutationVariables,
  environment: Environment,
  onCompleted: ?(response: ?DeleteFromCartMutationResponse, errors: ?Array<Error>) => void,
  onError: ?(error: Error) => void,
}

const commit = (params: DeleteFromCartParams) => commitMutation(params.environment, {
  mutation,
  variables: {
    input: { ...params.input },
  },
  updater: (relayStore) => {
    const me = relayStore.getRoot().getLinkedRecord('me');
    const stores = me.getLinkedRecord('stores').getLinkedRecords('edges').map(edge => egde.getLinkedRecord('node'));
    debugger;
    // const store = relayStore.get()
  },
  onCompleted: params.onCompleted,
  onError: params.onError,
});

export default { commit };
