// @flow strict

import React from 'react';
import classNames from 'classnames';

import { formatPrice } from 'utils';

import './CurrencyPrice.scss';

type PropTypes = {
  price: number,
  currencyPrice: number,
  currencyCode: string,
  toFixedValue?: number,
  withLambda?: boolean,
  reverse?: boolean,
  dark?: boolean,
  fontSize?: number,
};

const CurrencyPrice = ({
  price,
  currencyPrice,
  currencyCode,
  toFixedValue,
  withLambda,
  reverse,
  dark,
  fontSize,
}: PropTypes) => {
  let newPrice = price * currencyPrice;
  //
  if (toFixedValue !== undefined) {
    newPrice = (price * currencyPrice).toFixed(toFixedValue);
  }
  return (
    <div
      styleName={classNames('container', { withLambda, dark })}
      style={{ fontSize }}
    >
      {reverse === false &&
        `${formatPrice(parseFloat(newPrice))} ${currencyCode}`}
      {reverse === true &&
        `${currencyCode}${formatPrice(parseFloat(newPrice))}`}
    </div>
  );
};

CurrencyPrice.defaultProps = {
  toFixedValue: undefined,
  withLambda: false,
  reverse: false,
  dark: undefined,
  fontSize: 12,
};

export default CurrencyPrice;
