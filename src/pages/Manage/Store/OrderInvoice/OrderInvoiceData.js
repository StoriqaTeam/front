// @flow strict

import React from 'react';

import './OrderInvoice.scss';

type PropsType = {
  receiverName: string,
  slug: string,
  trackId: ?string,
  state: string,
};

const OrderInvoiceData = ({
  receiverName,
  slug,
  trackId,
  state,
}: PropsType) => (
  <div styleName="invoiceData">
    <div>
      <span styleName="customerData">Customer: </span> {receiverName}
    </div>
    <div>
      <span styleName="customerData">Order #: </span> {slug}
    </div>
    <div>
      <span styleName="customerData">Track ID: </span> {trackId}
    </div>
    <div>
      <span styleName="customerData">Delivery: </span>
    </div>
    <div>
      <span styleName="customerData">Status: </span>
      {state}
    </div>
  </div>
);

export default OrderInvoiceData;
