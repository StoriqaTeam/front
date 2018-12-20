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
  withTilda?: boolean,
  reverse?: boolean,
  dark?: boolean,
  black?: boolean,
  fontSize?: number,
};

const CurrencyPrice = ({
  price,
  currencyPrice,
  currencyCode,
  toFixedValue,
  withTilda,
  reverse,
  dark,
  fontSize,
  black,
}: PropTypes) => {
  let newPrice = price * currencyPrice;
  if (toFixedValue !== undefined) {
    newPrice = (price * currencyPrice).toFixed(toFixedValue);
  }
  return (
    <div
      styleName={classNames('container', { dark, black })}
      style={{ fontSize }}
    >
      {withTilda === true && <span>~</span>}
      {reverse === false &&
        `${formatPrice(parseFloat(newPrice))} ${currencyCode}`}
      {reverse === true &&
        `${currencyCode}${formatPrice(parseFloat(newPrice))}`}
    </div>
  );
};

CurrencyPrice.defaultProps = {
  toFixedValue: undefined,
  withTilda: false,
  reverse: false,
  dark: undefined,
  black: undefined,
  fontSize: 12,
};

export default CurrencyPrice;
