// @flow strict

/* eslint-disable */

export default (data: {
  transactionId: string,
  items: Array<{
    id: number,
    qnt: number,
    price: number,
  }>,
}): void => {
  if (window) {
    (window['rrApiOnReady'] = window['rrApiOnReady'] || []).push(function() {
      try {
        // $FlowIgnore
        rrApi.order({
          transaction: data.transactionId,
          items: data.items,
        });
      } catch (e) {}
    });
  }
};

/* eslint-enable */
