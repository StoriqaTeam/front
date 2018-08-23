// @flow

import React from 'react';
import classNames from 'classnames';

import { formatPrice } from 'utils';

import './ProductPrice.scss';

type PropsType = {
  currency?: string,
  price: number,
  cashback: number,
  discount: number,
  buttonText?: string,
};

const ProductPrice = ({
  currency,
  price,
  cashback,
  discount,
  buttonText,
}: PropsType) => (
  <div styleName="container">
    {discount && discount > 0 ? (
      <span styleName="lastPrice">
        {formatPrice(price)} {currency}
      </span>
    ) : null}
    <div styleName="stq">
      <span styleName="price">
        {formatPrice(discount && discount > 0 ? price * (1 - discount) : price)}{' '}
        {currency}
      </span>
      <span styleName={classNames('cashback', { noCashback: !cashback })}>
        {buttonText} {`${cashback ? (cashback * 100).toFixed(0) : 0}%`}
      </span>
    </div>
  </div>
);

ProductPrice.defaultProps = {
  currency: 'STQ',
  buttonText: 'Cashback',
};

export default ProductPrice;
