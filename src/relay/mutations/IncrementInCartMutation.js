// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment, ConnectionHandler } from 'relay-runtime';
import { findIndex } from 'ramda';

import type {
  IncrementInCartMutationVariables,
  IncrementInCartMutationResponse,
} from './__generated__/IncrementInCartMutation.graphql';

// const mutation = graphql`
//   mutation IncrementInCartMutation($input: IncrementInCartInput!) {
//     incrementInCart(input: $input) {
//       ...CartStore_store
//     }
//   }
// `;

const mutation = graphql`
  mutation IncrementInCartMutation($input: IncrementInCartInput!) {
    incrementInCart(input: $input) {
      ...Cart_cart
    }
  }
`;

export type IncrementInCartParams = {
  ...IncrementInCartMutationVariables,
  environment: Environment,
  onCompleted: ?(
    response: ?IncrementInCartMutationResponse,
    errors: ?Array<Error>,
  ) => void,
  onError: ?(error: Error) => void,
};

const commit = (params: IncrementInCartParams) =>
  commitMutation(params.environment, {
    mutation,
    variables: {
      input: { ...params.input },
    },
    onCompleted: params.onCompleted,
    onError: params.onError,
    optimisticUpdater: relayStore => {
      const cart = relayStore.getRoot().getLinkedRecord('cart');
      const storesConnection = ConnectionHandler.getConnection(
        cart,
        'Cart_stores',
      );
      // The idea is to just create random store with random product that will
      // definitely increase the cart counter, and will be gone as
      // soon as we get the response from server
      const store = relayStore.create(
        Math.random()
          .toString(36)
          .substring(7),
        'CartStore',
      );
      const product = relayStore.create(
        Math.random()
          .toString(36)
          .substring(7),
        'CartProduct',
      );
      product.setValue(1, 'quantity');
      store.setLinkedRecords([product], 'products');
      const edge = ConnectionHandler.createEdge(
        relayStore,
        storesConnection,
        store,
        'CartStoresEdge',
      );
      ConnectionHandler.insertEdgeAfter(storesConnection, edge);
    },
    updater: relayStore => {
      const store = relayStore.getRootField('incrementInCart');
      const cart = relayStore.getRoot().getLinkedRecord('cart');
      const storesConnection = ConnectionHandler.getConnection(
        cart,
        'Cart_stores',
      );
      const storeIds = storesConnection
        .getLinkedRecords('edges')
        .map(e => e.getLinkedRecord('node').getDataID());
      if (findIndex(id => id === store.getDataID(), storeIds) === -1) {
        const edge = ConnectionHandler.createEdge(
          relayStore,
          storesConnection,
          store,
          'CartStoresEdge',
        );
        ConnectionHandler.insertEdgeAfter(storesConnection, edge);
      }
    },
  });

export default { commit };
