// @flow

import { fetchQuery, graphql } from 'react-relay';
import { Environment } from 'relay-runtime';

const BUYNOW_QUERY = graphql`
  query fetchBuyNow_Query(
    $productId: Int!
    $quantity: Int!
    $couponCode: String
    $shippingId: Int
  ) {
    calculateBuyNow(
      productId: $productId
      quantity: $quantity
      couponCode: $couponCode
      shippingId: $shippingId
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
    shippingId?: ?number,
  },
) => fetchQuery(environment, BUYNOW_QUERY, variables);

export default fetchBuyNow;
