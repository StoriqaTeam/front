// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

import type { BuyNowMutationResponse } from './__generated__/BuyNowMutation.graphql';

export type { BuyNowMutationResponse as BuyNowMutationResponseType };

const mutation = graphql`
  mutation BuyNowMutation($input: BuyNowInput!) {
    buyNow(input: $input) {
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
        priceReservedDueDateTime
        state
        wallet
        transactions {
          id
          amount
        }
        orders {
          slug
        }
      }
    }
  }
`;

type AddressParamsType = {
  country: ?string,
  value: ?string,
  administrativeAreaLevel1: ?string,
  administrativeAreaLevel2: ?string,
  locality: ?string,
  political: ?string,
  postalCode: ?string,
  route: ?string,
  streetNumber: ?string,
};

type BuyNowMutationVariables = {
  input: {
    receiverName: string,
    receiverPhone: string,
    addressFull: AddressParamsType,
  },
};

export type MutationParamsType = {
  ...BuyNowMutationVariables,
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
