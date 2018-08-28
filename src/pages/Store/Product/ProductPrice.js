// @flow

import React from 'react';
import classNames from 'classnames';
import { map, addIndex } from 'ramda';

import { MultiCurrencyDropdown } from 'components/common/MultiCurrencyDropdown';
import { formatPrice } from 'utils';

import './ProductPrice.scss';

type PropsType = {
  currency?: string,
  price: number,
  cashback: number,
  discount: number,
  buttonText?: string,
};

const indexedMap = addIndex(map);

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
      <MultiCurrencyDropdown
        price={discount && discount > 0 ? price * (1 - discount) : price}
        renderPrice={(item: { price: number, currencyCode: string }) => (
          <span styleName="price">
            {formatPrice(item.price)} {item.currencyCode}
          </span>
        )}
        renderDropdown={(
          rates: Array<{ currencyCode: string, value: number }>,
        ) => (
          <div styleName="priceDropdownList">
            {indexedMap(
              (item, idx) => (
                <div key={`priceDropdownItem-${idx}-${item.currencyCode}`}>
                  {`${item.value.toFixed(8)} ${item.currencyCode}`}
                </div>
              ),
              rates,
            )}
          </div>
        )}
        renderDropdownToggle={(isDropdownOpened: boolean) => (
          <button
            styleName={
              isDropdownOpened ? 'dropdownToggleOpened' : 'dropdownToggleClosed'
            }
          />
        )}
      />
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
