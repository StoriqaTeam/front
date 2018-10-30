// @flow strict

import React from 'react';

import { formatStatus } from '../utils';

import '../OrderInvoice.scss';

import t from './i18n';

type PropsType = {
  +receiverName: string,
  +slug: string,
  +trackId: ?string,
  +state: string,
};

const OrderInvoiceData = ({
  receiverName,
  slug,
  trackId,
  state,
}: PropsType) => (
  <div styleName="invoiceData">
    <div>
      <span styleName="customerData">{t.customer}: </span> {receiverName}
    </div>
    <div>
      <span styleName="customerData">{t.order}: </span> {slug}
    </div>
    <div>
      <span styleName="customerData">{t.trackID}: </span> {trackId}
    </div>
    <div>
      <span styleName="customerData">{t.delivery}: </span>
    </div>
    <div>
      <span styleName="customerData">{t.status}: </span>
      {formatStatus(state)}
    </div>
  </div>
);

export default OrderInvoiceData;
