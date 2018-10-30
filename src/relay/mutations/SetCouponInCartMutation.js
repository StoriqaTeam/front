// @flow

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
      totalCost
      totalCount
      stores {
        edges {
          node {
            id
            rawId
            products {
              id
              rawId
              coupon {
                id
                rawId
                code
                title
                usedQuantity
                isActive
              }
            }
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
