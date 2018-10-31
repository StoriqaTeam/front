// @flow strict

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

import type {
  SetCouponInCartMutationVariables,
  SetCouponInCartMutationResponse,
} from './__generated__/UpdateUserDeliveryAddressFullMutation.graphql';

const mutation = graphql`
  mutation SetCouponInCartMutation($input: SetCouponInCartInput!) {
    setCouponInCart(input: $input) {
      id
      productsCost
      deliveryCost
      totalCount
      totalCost
      totalCostWithoutDiscounts
      couponsDiscounts
      stores {
        edges {
          node {
            id
            rawId
            productsCost
            deliveryCost
            totalCost
            totalCount
            ...CartStore_store
          }
        }
      }
    }
  }
`;

export type MutationParamsType = {
  ...SetCouponInCartMutationVariables,
  environment: Environment,
  onCompleted: ?(
    response: ?SetCouponInCartMutationResponse,
    errors: ?Array<Error>,
  ) => void,
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
