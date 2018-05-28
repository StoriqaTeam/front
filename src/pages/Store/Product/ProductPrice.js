// @flow

import React from 'react';

import './ProductPrice.scss';

type PropsType = {
  currency?: string,
  lastPrice: number,
  price: string,
  cashback: number,
  buttonText?: string,
};

const ProductPrice = ({
  currency,
  lastPrice,
  price,
  cashback,
  buttonText,
}: PropsType) => (
  <div styleName="container">
    {lastPrice > 0 ? (
      <span styleName="lastPrice">
        {lastPrice} {currency}
      </span>
    ) : null}
    <div styleName="stq">
      <span styleName="price">
        {price} {currency}
      </span>
      <span styleName={`cashback ${cashback > 0 ? '' : 'noCashback'}`}>
        {buttonText} {`${cashback}%`}
      </span>
    </div>
  </div>
);

ProductPrice.defaultProps = {
  currency: 'STQ',
  buttonText: 'Cashback',
};

export default ProductPrice;
