// @flow strict

/* eslint-disable */

export default (productId: number): void => {
  if (window) {
    (window['rrApiOnReady'] = window['rrApiOnReady'] || []).push(function() {
      try {
        // $FlowIgnore
        rrApi.view(productId);
      } catch (e) {}
    });
  }
};

/* eslint-enable */
