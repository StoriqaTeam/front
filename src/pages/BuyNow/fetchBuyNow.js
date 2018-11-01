// @flow

import { fetchQuery, graphql } from 'react-relay';
import { Environment } from 'relay-runtime';

const BUYNOW_QUERY = graphql`
  query fetchBuyNow_Query($productId: Int!, $quantity: Int!, $couponCode: String) {
    calculateBuyNow(productId: $productId, quantity: $quantity, couponCode: $couponCode) {
      product {
        id
        rawId
      }
      couponsDiscounts
      totalCost
      totalCostWithoutDiscounts
      totalCount
    }
  }
`;

const fetchBuyNow = (
  environment: Environment,
  variables: {
    productId: number,
    quantity: number,
    couponCode?: string,
  },
) => fetchQuery(environment, BUYNOW_QUERY, variables);

export default fetchBuyNow;
