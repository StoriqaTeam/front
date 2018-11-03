// @flow strict

import { graphql } from 'react-relay';
import { basicMutation } from 'relay/mutations/basicMutation';
import type { MutationType } from 'relay/mutations/basicMutation/basicMutation';

import type {
  RemoveDeliveryMethodForProductMutationVariables,
  RemoveDeliveryMethodForProductMutationResponse,
} from './__generated__/RemoveDeliveryMethodForProductMutation.graphql';

const mutation = graphql`
  mutation RemoveDeliveryMethodForProductMutation(
    $input: RemoveDeliveryMethodFromCartInput!
  ) {
    removeDeliveryMethodFromCart(input: $input) {
      id
      productsCost
      deliveryCost
      totalCost
      totalCount
      couponsDiscounts
      stores {
        edges {
          node {
            id
            products {
              id
              subtotal
              deliveryCost
              companyPackage {
                id
                rawId
              }
            }
          }
        }
      }
    }
  }
`;

const removeDeliveryMethodForProductMutation: MutationType<
  RemoveDeliveryMethodForProductMutationVariables,
  RemoveDeliveryMethodForProductMutationResponse,
> = basicMutation(mutation, 'removeDeliveryMethodFromCart');

export default removeDeliveryMethodForProductMutation;
