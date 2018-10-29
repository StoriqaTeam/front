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
  forProduct?: boolean,
  reverse?: boolean,
};

const CurrencyPrice = ({
  price,
  currencyPrice,
  currencyCode,
  toFixedValue,
  forProduct,
  reverse,
}: PropTypes) => {
  let newPrice = price * currencyPrice;
  if (toFixedValue !== undefined) {
    newPrice = (price * currencyPrice).toFixed(toFixedValue);
  }
  return (
    <div styleName={classNames('container', { forProduct })}>
      {reverse === false &&
        `${formatPrice(parseFloat(newPrice))} ${currencyCode}`}
      {reverse === true &&
        `${currencyCode}${formatPrice(parseFloat(newPrice))}`}
    </div>
  );
};

CurrencyPrice.defaultProps = {
  toFixedValue: undefined,
  forProduct: false,
  reverse: false,
};

export default CurrencyPrice;
