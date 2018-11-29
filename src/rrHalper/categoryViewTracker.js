// @flow strict

/* eslint-disable */

export default (categoryId: number): void => {
  if (window) {
    (window['rrApiOnReady'] = window['rrApiOnReady'] || []).push(function() {
      try {
        // $FlowIgnore
        rrApi.categoryView(categoryId);
      } catch (e) {}
    });
  }
};

/* eslint-enable */
