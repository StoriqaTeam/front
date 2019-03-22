// @flow strict

import React from 'react';
import classNames from 'classnames';
import { formatPrice, getExchangePrice, checkCurrencyType } from 'utils';
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
  currency: 'STQ' | 'ETH' | 'BTC' | 'USD' | 'EUR',
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
    currency,
    currencyExchange: directories.currencyExchange,
  });
  const discountedPriceExchanged = getExchangePrice({
    price: discountedPrice,
    currency,
    currencyExchange: directories.currencyExchange,
  });
  return (
    <div styleName="container">
      {Boolean(discount) &&
        discount > 0 && (
          <div styleName="price">
            <div styleName="title">
              <strong>{t.price}</strong>
            </div>
            <thin styleName="lastPrice">
              {priceExchanged != null ? (
                <span>{priceExchanged}</span>
              ) : (
                <span>
                  {formatPrice(
                    price,
                    checkCurrencyType(currency) === 'fiat' ? 2 : undefined,
                  )}{' '}
                  {currency}
                </span>
              )}
            </thin>
          </div>
        )}
      <div styleName="stq">
        <div styleName="title">
          <strong>
            {Boolean(discount) && discount > 0 ? t.discountPrice : t.price}
          </strong>
        </div>
        <div styleName="discountPrice">
          <b styleName="basePrice">
            {priceExchanged != null ? (
              <span>{discountedPriceExchanged}</span>
            ) : (
              <span>
                {formatPrice(
                  discountedPrice,
                  checkCurrencyType(currency) === 'fiat' ? 2 : undefined,
                )}{' '}
                {currency}
              </span>
            )}
          </b>
          {priceExchanged != null && (
            <div styleName="currencyPrice">
              {`~${formatPrice(
                discountedPrice,
                checkCurrencyType(currency) === 'fiat' ? 2 : undefined,
              )} ${currency}`}
            </div>
          )}
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
  buttonText: t.cashback,
};

export default ContextDecorator(ProductPrice);
