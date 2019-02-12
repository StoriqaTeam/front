// @flow strict

import { graphql } from 'react-relay';
import { basicMutation } from 'relay/mutations/basicMutation';
import type { MutationType } from 'relay/mutations/basicMutation/basicMutation';

import type {
  SetDeliveryPackageInCartMutationVariables,
  SetDeliveryPackageInCartMutationResponse,
} from './__generated__/SetDeliveryPackageInCartMutation.graphql';

const mutation = graphql`
  mutation SetDeliveryPackageInCartMutation(
    $input: SetDeliveryMethodInCartInput!
  ) {
    setDeliveryMethodInCart(input: $input) {
      id
      totalCount
      fiat {
        id
        productsCost
        deliveryCost
        totalCount
        totalCost
        totalCostWithoutDiscounts
        productsCostWithoutDiscounts
        couponsDiscounts
        stores {
          edges {
            node {
              id
              ...CartStore_store
              productsCost
              deliveryCost
              totalCost
              totalCount
              products {
                id
                selected
                baseProduct(visibility: "active") {
                  id
                  isShippingAvailable
                }
                quantity
              }
            }
          }
        }
      }
      crypto {
        id
        productsCost
        deliveryCost
        totalCount
        totalCost
        totalCostWithoutDiscounts
        productsCostWithoutDiscounts
        couponsDiscounts
        stores {
          edges {
            node {
              id
              ...CartStore_store
              productsCost
              deliveryCost
              totalCost
              totalCount
              products {
                id
                selected
                baseProduct(visibility: "active") {
                  id
                  isShippingAvailable
                }
                quantity
              }
            }
          }
        }
      }
    }
  }
`;

const setDeliveryPackageInCartMutation: MutationType<
  SetDeliveryPackageInCartMutationVariables,
  SetDeliveryPackageInCartMutationResponse,
> = basicMutation(mutation, 'setDeliveryMethodInCart');

export default setDeliveryPackageInCartMutation;
