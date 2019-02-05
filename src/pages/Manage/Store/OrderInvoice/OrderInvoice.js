// @flow strict

import React, { PureComponent } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { Link } from 'found';
import { Icon } from 'components/Icon';
import { isNil } from 'ramda';

import type { OrderInvoice_me as OrderInvoiceType } from './__generated__/OrderInvoice_me.graphql';

import {
  OrderInvoiceData,
  OrderInvoiceAddress,
  OrderInvoiceTable,
  OrderInvoiceTableRow,
  InvoiceTotal,
} from './index';

import { pluckFromOrder } from './utils';

import './OrderInvoice.scss';

import t from './i18n';

type PropsType = {
  me: OrderInvoiceType,
};

class OrderInvoice extends PureComponent<PropsType> {
  render() {
    const {
      me: { order },
    } = this.props;
    const fromOrder = pluckFromOrder(order);
    const clonedOrder = !isNil(order) ? { ...order } : {};
    const invoiceData = fromOrder(['receiverName', 'slug', 'trackId', 'state']);
    const email = !isNil(order) ? order.receiverEmail : '';
    const address = !isNil(order) ? order.addressFull : {};
    const phone = !isNil(order) ? order.receiverPhone : '';
    const currency = !isNil(order) ? order.currency : '';
    const invoiceAddress = { ...address, email, phone };
    // const quantity = !isNil(order) ? order.quantity : 0;
    const totalAmount = !isNil(order) ? order.totalAmount : 0;
    // const total = product([quantity, totalAmount]);
    return (
      <section styleName="container">
        <header styleName="header">
          <h2 styleName="title">{t.invoice}</h2>
          <div styleName="logo">
            <Link to="/" data-test="logoLink">
              <Icon type="logo" />
            </Link>
          </div>
        </header>
        <div styleName="invoiceDetails">
          {/* $FlowIgnoreMe */}
          <OrderInvoiceData {...invoiceData} />
          <OrderInvoiceAddress {...invoiceAddress} />
        </div>
        <div styleName="table">
          <div styleName="tableWrapper">
            <OrderInvoiceTable>
              {/* $FlowIgnoreMe */}
              <OrderInvoiceTableRow {...clonedOrder} />
              <InvoiceTotal
                total={totalAmount}
                currency={currency}
                shipping="N/A"
              />
            </OrderInvoiceTable>
          </div>
        </div>
      </section>
    );
  }
}

export default createFragmentContainer(
  OrderInvoice,
  graphql`
    fragment OrderInvoice_me on User
      @argumentDefinitions(slug: { type: "Int!", defaultValue: 0 }) {
      order(slug: $slug) {
        slug
        currency
        receiverName
        receiverPhone
        receiverEmail
        trackId
        state
        quantity
        price
        totalAmount
        subtotal
        product {
          currency
          attributes {
            value
          }
          baseProduct {
            name {
              lang
              text
            }
          }
        }
        addressFull {
          value
          country
          administrativeAreaLevel1
          administrativeAreaLevel2
          locality
          political
          postalCode
          route
          streetNumber
          placeId
        }
      }
    }
  `,
);
