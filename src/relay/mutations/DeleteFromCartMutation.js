// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment, ConnectionHandler } from 'relay-runtime';
import { filter } from 'ramda';

import type {
  DeleteFromCartMutationVariables,
  DeleteFromCartMutationResponse,
} from './__generated__/IncrementInCartMutation.graphql';

const mutation = graphql`
  mutation DeleteFromCartMutation($input: DeleteFromCartInput!) {
    deleteFromCart(input: $input) {
      productId
      storeId
    }
  }
`;

export type DeleteFromCartParams = {
  ...DeleteFromCartMutationVariables,
  environment: Environment,
  onCompleted: ?(
    response: ?DeleteFromCartMutationResponse,
    errors: ?Array<Error>,
  ) => void,
  onError: ?(error: Error) => void,
};

const commit = (params: DeleteFromCartParams) =>
  commitMutation(params.environment, {
    mutation,
    variables: {
      input: { ...params.input },
    },
    updater: relayStore => {
      const productId = relayStore
        .getRootField('deleteFromCart')
        .getValue('productId');
      const storeId = relayStore
        .getRootField('deleteFromCart')
        .getValue('storeId');
      const store = relayStore.get(storeId);
      const products = store.getLinkedRecords('products');
      if (products.length > 1) {
        const filtered = filter(
          product => product.getDataID() === productId,
          products,
        );
        store.setLinkedRecords(filtered, 'products');
      } else {
        const me = relayStore.getRoot().getLinkedRecord('me');
        const cart = me.getLinkedRecord('cart');
        const connection = ConnectionHandler.getConnection(cart, 'Cart_stores');
        ConnectionHandler.deleteNode(connection, storeId);
        relayStore.delete(storeId);
      }
    },
    onCompleted: params.onCompleted,
    onError: params.onError,
  });

export default { commit };
