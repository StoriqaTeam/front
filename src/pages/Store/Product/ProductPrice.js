// @flow

import React from 'react';

import './ProductPrice.scss';

type PropsType = {
  currency?: string,
  lastPrice: string,
  currentPrice: string,
  percentage: string,
  buttonText?: string,
};

const ProductPrice = (props: PropsType) => {
  const { currency, lastPrice, currentPrice, percentage, buttonText } = props;
  return (
    <div styleName="container">
      <span styleName="lasPrice">
        {lastPrice} {currency}
      </span>
      <div styleName="stq">
        <span styleName="currentPrice">
          {currentPrice} {currency}
        </span>
        <button>
          {buttonText} {`${percentage}%`}
        </button>
      </div>
    </div>
  );
};

ProductPrice.defaultProps = {
  currency: 'STQ',
  buttonText: 'Cashback',
};

export default ProductPrice;
