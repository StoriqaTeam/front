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

const setDeliveryPackageInCartMutation: MutationType<
  SetDeliveryPackageInCartMutationVariables,
  SetDeliveryPackageInCartMutationResponse,
> = basicMutation(mutation, 'setDeliveryMethodInCart');

export default setDeliveryPackageInCartMutation;
