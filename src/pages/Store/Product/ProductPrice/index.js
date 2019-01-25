// @flow strict

import React from 'react';
import classNames from 'classnames';
import { formatPrice, currentCurrency, getExchangePrice } from 'utils';
import { ContextDecorator } from 'components/App';

import './ProductPrice.scss';

import t from './i18n';

type CurrencyExhangeType = {
  code: string,
  rates: Array<{
    code: string,
    value: number,
  }>,
};

type PropsType = {
  currency?: 'STQ' | 'ETH' | 'BTC' | 'USD' | 'EUR',
  price: number,
  cashback: number,
  discount: number,
  buttonText?: string,
  directories: {
    currencyExchange: Array<CurrencyExhangeType>,
  },
};

const ProductPrice = ({
  currency,
  price,
  cashback,
  discount,
  buttonText,
  directories,
}: PropsType) => {
  const discountedPrice = discount ? price * (1 - discount) : price;
  // const discountValue = discount ? (discount * 100).toFixed(0) : null;
  // const cashbackValue = cashback ? (cashback * 100).toFixed(0) : null;
  const priceExchanged = getExchangePrice({
    price,
    // $FlowIgnore
    currency,
    currencyExchange: directories.currencyExchange,
    withSymbol: true,
  });
  return (
    <div styleName="container">
      {discount && discount > 0 ? (
        <div styleName="price">
          <div styleName="title">
            <strong>{t.price}</strong>
          </div>
          <thin styleName="lastPrice">
            {formatPrice(price)} {currency}
          </thin>
        </div>
      ) : null}
      <div styleName="stq">
        <div styleName="title">
          <strong>{t.discountPrice}</strong>
        </div>
        <div styleName="discountPrice">
          <b styleName="basePrice">
            {discountedPrice} {currency}
          </b>
          <div styleName="currencyPrice">{priceExchanged}</div>
        </div>
        {Boolean(cashback) && (
          <div styleName={classNames('cashback', { noCashback: !cashback })}>
            {buttonText} {`${cashback ? (cashback * 100).toFixed(0) : 0}%`}
          </div>
        )}
      </div>
    </div>
  );
};

ProductPrice.defaultProps = {
  currency: currentCurrency() || 'STQ',
  buttonText: t.cashback,
};

export default ContextDecorator(ProductPrice);
