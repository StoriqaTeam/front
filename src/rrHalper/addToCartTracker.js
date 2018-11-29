// @flow strict

/* eslint-disable */

export default (productId: number): void => {
  try {
    // $FlowIgnore
    rrApi.addToBasket(productId);
  } catch (e) {}
};

/* eslint-enable */
