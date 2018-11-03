// @flow

import { fetchQuery, graphql } from 'react-relay';
import { Environment } from 'relay-runtime';

const BUYNOW_QUERY = graphql`
  query fetchBuyNow_Query(
    $productId: Int!
    $quantity: Int!
    $couponCode: String
    $companyPackageId: Int
  ) {
    calculateBuyNow(
      productId: $productId
      quantity: $quantity
      couponCode: $couponCode
      companyPackageId: $companyPackageId
    ) {
      product {
        id
        rawId
      }
      couponsDiscounts
      totalCost
      totalCostWithoutDiscounts
      totalCount
      deliveryCost
      subtotal
      subtotalWithoutDiscounts
      price
    }
  }
`;

const fetchBuyNow = (
  environment: Environment,
  variables: {
    productId: number,
    quantity: number,
    couponCode?: ?string,
    companyPackageId?: ?number,
  },
) => fetchQuery(environment, BUYNOW_QUERY, variables);

export default fetchBuyNow;
