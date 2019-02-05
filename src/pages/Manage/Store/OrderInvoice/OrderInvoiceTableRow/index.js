// @flow strict

import React from 'react';
import { join, map, prop, isEmpty } from 'ramda';

import type { TranslationType } from 'types';

import { extractText } from 'utils';

import '../OrderInvoice.scss';

type PropsType = {
  slug: number,
  totalAmount: number,
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
  totalAmount,
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
      <div styleName="tableRowItem">-</div>
      <div styleName="tableRowItem">
        {' '}
        {totalAmount} - {currency}
      </div>
    </div>
  );
};

export default OrderInvoiceTableRow;
