// @flow strict

import React, { Component } from 'react';
import { Link } from 'found';

import { Icon } from 'components/Icon';

import {
  OrderInvoiceData,
  OrderInvoiceAddress,
  OrderInvoiceTable,
  OrderInvoiceTableRow,
} from './index';

import './OrderInvoice.scss';

class OrderInvoice extends Component<{}> {
  handleClick = () => {};

  render() {
    return (
      <section styleName="container">
        <header styleName="header">
          <h2 styleName="title">Invoice</h2>
          <div>
            <Link to="/" data-test="logoLink">
              <Icon type="logo" />
            </Link>
          </div>
        </header>
        <div styleName="invoiceDetails">
          <OrderInvoiceData />
          <OrderInvoiceAddress />
        </div>
        <OrderInvoiceTable>
          <OrderInvoiceTableRow />
          <OrderInvoiceTableRow />
          <OrderInvoiceTableRow />
        </OrderInvoiceTable>
      </section>
    );
  }
}

export default OrderInvoice;
