// @flow

import React from 'react';
import { map } from 'ramda';

import { formatPrice, currentCurrency } from 'utils';

import './CardProductDropdown.scss';

type PropsType = {
  rates: Array<{ currencyCode: string, value: number }>,
};

const CardProductDropdown = ({ rates }: PropsType) => (
  <div styleName="priceDropdownList">
    {map(
      item =>
        item.currencyCode !== currentCurrency() && (
          <div key={`priceDropdownItem-${item.currencyCode}`}>
            {`${formatPrice(item.value)} ${item.currencyCode}`}
          </div>
        ),
      rates,
    )}
  </div>
);

export default CardProductDropdown;
