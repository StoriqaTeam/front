// @flow

import React from 'react';

import './ProductPrice.scss';

type PropsType = {
  currency?: string,
  crossedPrice: string,
  price: string,
  cashback: number,
  buttonText?: string,
};

const ProductPrice = ({
  currency,
  crossedPrice,
  price,
  cashback,
  buttonText,
}: PropsType) => (
  <div styleName="container">
    {price.toString() === crossedPrice ? null : (
      <span styleName="crossedPrice">
        {crossedPrice} {currency}
      </span>
    )}
    <div styleName="stq">
      <span styleName="price">
        {price} {currency}
      </span>
      <button styleName={cashback > 0 ? '' : 'noCashback'}>
        {buttonText} {`${cashback}%`}
      </button>
    </div>
  </div>
);

ProductPrice.defaultProps = {
  currency: 'STQ',
  buttonText: 'Cashback',
};

export default ProductPrice;
