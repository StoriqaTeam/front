// @flow strict

import React, { Fragment } from 'react';
import type { Node } from 'react';

import './OrderInvoice.scss';

type PropsType = {
  children: Node,
};

const OrderInvoiceTable = ({ children }: PropsType) => (
  <Fragment>
    <div styleName="tableHeader">
      <div styleName="tableHeaderItem">No.</div>
      <div styleName="tableHeaderItem">Description</div>
      <div styleName="tableHeaderItem">Quantity</div>
      <div styleName="tableHeaderItem">Unit Price</div>
      <div styleName="tableHeaderItem">Price</div>
    </div>
    {children}
  </Fragment>
);

export default OrderInvoiceTable;
