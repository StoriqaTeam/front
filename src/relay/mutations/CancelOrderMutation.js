// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

import type {
  CancelOrderMutationVariables,
  CancelOrderMutationResponse,
} from './__generated__/CancelOrderMutation.graphql';

export type {
  CancelOrderMutationResponse as CancelOrderMutationResponseType,
} from './__generated__/CancelOrderMutation.graphql';

const mutation = graphql`
  mutation CancelOrderMutation($input: OrderStatusCanceledInput!) {
    setOrderStatusCanceled(input: $input) {
      id
      slug
      storeId
      product {
        baseProduct {
          rawId
          name {
            text
          }
          category {
            rawId
            name {
              text
              lang
            }
          }
        }
        price
        attributes {
          value
          attribute {
            name {
              lang
              text
            }
          }
        }
        photoMain
      }
      receiverName
      addressFull {
        value
      }
      createdAt
      deliveryCompany
      trackId
      quantity
      subtotal
      state
      paymentStatus
      history {
        edges {
          node {
            state
            committedAt
            committerRole
            comment
          }
        }
      }
    }
  }
`;

export type MutationParamsType = {|
  ...CancelOrderMutationVariables,
  environment: Environment,
  onCompleted: ?(
    response: ?CancelOrderMutationResponse,
    errors: ?Array<Error>,
  ) => void,
  onError: ?(error: Error) => void,
|};

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
