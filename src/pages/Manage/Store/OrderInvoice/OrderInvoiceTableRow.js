// @flow strict

import React from 'react';
import { product } from 'ramda';

import type { TranslationType } from 'types';

import { extractText } from 'utils';

import './OrderInvoice.scss';

type PropsType = {
  slug: number,
  price: number,
  quantity: number,
  product: {
    currency: string,
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
    currency,
    baseProduct: { name },
  },
}: PropsType) => (
  <div styleName="tableRow">
    <div styleName="tableRowItem"> {slug} </div>
    <div styleName="tableRowItem"> {extractText(name, 'EN')}</div>
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

export default OrderInvoiceTableRow;
