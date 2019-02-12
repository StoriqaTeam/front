// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

import type { CreateOrdersMutationResponse } from './__generated__/CreateOrdersMutation.graphql';

export type {
  CreateOrdersMutationResponse as CreateOrdersMutationResponseType,
};

const mutation = graphql`
  mutation CreateOrdersMutation($input: CreateOrderInput!) {
    createOrders(input: $input) {
      cart {
        id
        totalCount
        stores {
          edges {
            node {
              id
            }
          }
        }
      }
      invoice {
        id
        amount
        amountCaptured
        currency
        priceReservedDueDateTime
        state
        wallet
        transactions {
          id
          amount
        }
        orders {
          id
          slug
          productId
          quantity
          price
        }
        paymentIntent {
          id
          clientSecret
          status
        }
      }
    }
  }
`;

type AddressParamsType = {
  country: string,
  value: string,
  administrativeAreaLevel1?: string,
  administrativeAreaLevel2?: string,
  locality: string,
  political?: string,
  postalCode: string,
  route?: string,
  streetNumber: string,
};

type CreateOrdersMutationVariables = {
  input: {
    receiverName: string,
    receiverPhone: string,
    addressFull: AddressParamsType,
  },
};

export type MutationParamsType = {
  ...CreateOrdersMutationVariables,
  environment: Environment,
  onCompleted: ?(response: ?Object, errors: ?Array<Error>) => void,
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
  });

export default { commit };
