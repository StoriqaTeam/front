// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment, ConnectionHandler } from 'relay-runtime';
import { head, pipe, map, contains, find, reject } from 'ramda';

import type { IncrementInCartMutationVariables, IncrementInCartMutationResponse } from './__generated__/IncrementInCartMutation.graphql';

const mutation = graphql`
  mutation IncrementInCartMutation($input: IncrementInCartInput!) {
    incrementInCart(input: $input) {
      stores {
        edges {
          node {
            ...CartStore_store
          }
          cursor
        }
      }
    }
  }
`;


// const mutation = graphql`
//   mutation IncrementInCartMutation($input: IncrementInCartInput!) {
//     incrementInCart(input: $input) {
//       stores {
//         edges {
//           node {
//             ... on CartStore {
//               id
//               name {
//                 lang
//                 text
//               }
//               rating
//               productsPrice
//               deliveryPrice
//               totalCount
//               products {
//                 edges {
//                   node {
//                     ... on CartProduct {
//                       id
//                       name {
//                         lang
//                         text
//                       }
//                       photoMain
//                       price
//                       quantity
//                       deliveryPrice
//                       attributes {
//                         value
//                         metaField
//                         attribute {
//                           name {
//                             lang
//                             text
//                           }  
//                           valueType
//                           metaField {
//                             values
//                             uiElement
//                             translatedValues {
//                               translations {
//                                 lang
//                                 text
//                               }
//                             }
//                           }
//                         }
//                       }
//                     }
//                   }
//                 }
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// `;

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
    const cartBase = relayStore.getRoot()
      .getLinkedRecord('me')
      .getLinkedRecord('cart');
    const storesBase = cartBase
      .getLinkedRecord('stores');
    const storesSink = relayStore
      .getRootField('incrementInCart')
      .getLinkedRecord('stores');
    const storeEdgeSink = head(storesSink.getLinkedRecords('edges'));
    const storeSink = storeEdgeSink.getLinkedRecord('node');
    const storesBaseNodes = storesBase.getLinkedRecords('edges').map(edge => edge.getLinkedRecord('node'));
    const storeBase = find(store => store.getDataID() === storeSink.getDataID(), storesBaseNodes);
    // if store already exists add product to the list of products
    if (storeBase) {
      const productsBase = storeBase.getLinkedRecords('products');
      const productSink = head(storeSink.getLinkedRecords('products'));
      if (!productSink) return;
      const filteredProductsBase = reject(x => x.getDataID() === productSink.getDataID(), productsBase);
      filteredProductsBase.push(productSink);
      storeSink.setLinkedRecords(filteredProductsBase);
    } else {
      const conn = ConnectionHandler.getConnection(cartBase, 'Cart_stores');
      ConnectionHandler.insertEdgeAfter(conn, storeEdgeSink);
    }
  }
});

export default { commit };
