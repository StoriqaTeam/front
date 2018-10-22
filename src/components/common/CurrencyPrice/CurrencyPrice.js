// @flow strict

import React from 'react';

import { formatPrice } from 'utils';

import './CurrencyPrice.scss';

type PropTypes = {
  price: number,
  currencyPrice: number,
  currencyCode: string,
  toFixedValue?: number,
};

const CurrencyPrice = ({
  price,
  currencyPrice,
  currencyCode,
  toFixedValue,
}: PropTypes) => {
  let newPrice = price * currencyPrice;
  if (toFixedValue !== undefined) {
    newPrice = (price * currencyPrice).toFixed(toFixedValue);
  }
  return (
    <div styleName="container">
      {`${formatPrice(parseFloat(newPrice))} ${currencyCode}`}
    </div>
  );
};

CurrencyPrice.defaultProps = {
  toFixedValue: undefined,
};

export default CurrencyPrice;
