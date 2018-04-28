// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment, ConnectionHandler } from 'relay-runtime';

import type { IncrementInCartMutationVariables, IncrementInCartMutationResponse } from './__generated__/IncrementInCartMutation.graphql';

const mutation = graphql`
  mutation IncrementInCartMutation($input: IncrementInCartInput!) {
    incrementInCart(input: $input) {
      stores {
        edges {
          node {
            ...CartStore_store
          }
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
  updater: (store, data) => {
    const ch = ConnectionHandler;
    debugger;
  }
});

export default { commit };
