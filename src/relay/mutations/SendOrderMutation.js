// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

import type {
  SendOrderMutationVariables,
  SendOrderMutationResponse,
} from './__generated__/SendOrderMutation.graphql';

export type {
  SendOrderMutationResponse as SendOrderMutationResponseType,
} from './__generated__/SendOrderMutation.graphql';

const mutation = graphql`
  mutation SendOrderMutation($input: OrderStatusDeliveryInput!) {
    setOrderStatusDelivery(input: $input) {
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
            user {
              firstName
              lastName
            }
            comment
          }
        }
      }
    }
  }
`;

export type MutationParamsType = {|
  ...SendOrderMutationVariables,
  environment: Environment,
  onCompleted: ?(
    response: ?SendOrderMutationResponse,
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
