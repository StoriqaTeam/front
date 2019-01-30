// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

import type {
  ConfirmOrderMutationVariables,
  ConfirmOrderMutationResponse,
} from './__generated__/ConfirmOrderMutation.graphql';

export type {
  ConfirmOrderMutationResponse as ConfirmOrderMutationResponseType,
} from './__generated__/ConfirmOrderMutation.graphql';

const mutation = graphql`
  mutation ConfirmOrderMutation($input: OrderConfirmedInput!) {
    confirmOrder(input: $input) {
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
  ...ConfirmOrderMutationVariables,
  environment: Environment,
  onCompleted: ?(
    response: ?ConfirmOrderMutationResponse,
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
