// @flow strict

import React from 'react';
import { product, join, map, prop, isEmpty } from 'ramda';

import type { TranslationType } from 'types';

import { extractText } from 'utils';

import './OrderInvoice.scss';

type PropsType = {
  slug: number,
  price: number,
  quantity: number,
  product: {
    currency: string,
    attributes: Array<{ value: string }>,
    baseProduct: {
      name: Array<TranslationType>,
    },
  },
};

const OrderInvoiceTableRow = ({
  slug,
  price,
  quantity,
  product: {
    attributes,
    currency,
    baseProduct: { name },
  },
}: PropsType) => {
  const description = !isEmpty(attributes)
    ? join(', ', map(prop('value'), attributes))
    : '';
  return (
    <div styleName="tableRow">
      <div styleName="tableRowItem"> {slug} </div>
      <div styleName="tableRowItem">
        {' '}
        {extractText(name, 'EN')} - {description}
      </div>
      <div styleName="tableRowItem"> {quantity}</div>
      <div styleName="tableRowItem">
        {' '}
        {price} - {currency}
      </div>
      <div styleName="tableRowItem">
        {' '}
        {product([quantity, price])} - {currency}
      </div>
    </div>
  );
};

export default OrderInvoiceTableRow;
