// @flow strict

import React, { PureComponent } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { Link } from 'found';
import { Icon } from 'components/Icon';
import { isNil, product } from 'ramda';

import type { OrderInvoice_me as OrderInvoiceType } from './__generated__/OrderInvoice_me.graphql';

import {
  OrderInvoiceData,
  OrderInvoiceAddress,
  OrderInvoiceTable,
  OrderInvoiceTableRow,
  InvoiceTotal,
} from './index';

import { formatStatus } from './utils';

import './OrderInvoice.scss';

import t from './i18n';

type PropsType = {
  me: OrderInvoiceType,
};

class OrderInvoice extends PureComponent<PropsType> {
  render() {
    const {
      me: { email, order },
    } = this.props;
    const clonedOrder = !isNil(order) ? order : {};
    const invoiceData = {
      receiverName: !isNil(order) ? order.receiverName : '',
      slug: !isNil(order) ? `${order.slug}` : '',
      trackId: !isNil(order) ? order.trackId : '',
      state: !isNil(order) ? formatStatus(order.state) : '',
    };
    const address = !isNil(order) ? order.addressFull : {};
    const phone = !isNil(order) ? order.receiverPhone : '';
    const currency = !isNil(order) ? order.currency : '';
    const invoiceAddress = { ...address, email, phone };
    const quantity = !isNil(order) ? order.quantity : 0;
    const price = !isNil(order) ? order.price : 0;
    const total = product([quantity, price]);
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
          <OrderInvoiceData {...invoiceData} />
          <OrderInvoiceAddress {...invoiceAddress} />
        </div>
        <div styleName="table">
          <div styleName="tableWrapper">
            <OrderInvoiceTable>
              {/* $FlowIgnoreMe */}
              <OrderInvoiceTableRow {...clonedOrder} />
              <InvoiceTotal total={`${total} ${currency}`} shipping="N/A" />
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
      email
      order(slug: $slug) {
        slug
        currency
        receiverName
        receiverPhone
        trackId
        state
        quantity
        price
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
