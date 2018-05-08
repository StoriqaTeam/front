// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment, ConnectionHandler } from 'relay-runtime';
import { findIndex } from 'ramda';

import type { IncrementInCartMutationVariables, IncrementInCartMutationResponse } from './__generated__/IncrementInCartMutation.graphql';

const mutation = graphql`
  mutation IncrementInCartMutation($input: IncrementInCartInput!) {
    incrementInCart(input: $input) {
      ...CartStore_store
    }
  }
`;


export type IncrementInCartParams = {
  ...IncrementInCartMutationVariables,
  environment: Environment,
  onCompleted: ?(response: ?IncrementInCartMutationResponse, errors: ?Array<Error>) => void,
  onError: ?(error: Error) => void,
}

const commit = (params: IncrementInCartParams) => commitMutation(params.environment, {
  mutation,
  variables: {
    input: { ...params.input },
  },
  onCompleted: params.onCompleted,
  onError: params.onError,
  updater: (relayStore) => {
    const store = relayStore.getRootField('incrementInCart');
    const me = relayStore.getRoot().getLinkedRecord('me');
    const cart = me.getLinkedRecord('cart');
    const storesConnection = ConnectionHandler.getConnection(cart, 'Cart_stores');
    const storeIds = storesConnection.getLinkedRecords('edges').map(e => e.getLinkedRecord('node').getDataID());
    console.log("ids", storeIds, store.getDataID());
    // debugger;
    if (findIndex(id => id === store.getDataID(), storeIds) === -1) {
      const edge = ConnectionHandler.createEdge(
        relayStore,
        storesConnection,
        store,
        'StoresEdge',
      );
      console.log("New edge: ", edge, params.environment);
      ConnectionHandler.insertEdgeAfter(storesConnection, edge);
    }
  }
});

export default { commit };
