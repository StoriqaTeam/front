// @flow strict

/* eslint-disable */

export default (email: string): void => {
  if (window) {
    (window['rrApiOnReady'] = window['rrApiOnReady'] || []).push(function() {
      // $FlowIgnore
      rrApi.setEmail(email);
    });
  }
};

/* eslint-enable */
