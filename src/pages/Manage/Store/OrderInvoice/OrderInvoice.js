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
} from './index';

import { formatStatus } from './utils';

import './OrderInvoice.scss';

type PropsType = {
  me: OrderInvoiceType,
};

class OrderInvoice extends PureComponent<PropsType> {
  render() {
    const {
      me: { email, myStore },
    } = this.props;
    const order = myStore && myStore.order;
    const invoiceData = {
      receiverName: !isNil(order) ? order.receiverName : '',
      slug: !isNil(order) ? `${order.slug}` : '',
      trackId: !isNil(order) ? order.trackId : '',
      state: !isNil(order) ? formatStatus(order.state) : '',
    };
    const address = !isNil(order) ? order.addressFull : {};
    const phone = !isNil(order) ? order.receiverPhone : '';
    const invoiceAddress = { ...address, email, phone };
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
          <OrderInvoiceData {...invoiceData} />
          <OrderInvoiceAddress {...invoiceAddress} />
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

export default createFragmentContainer(
  OrderInvoice,
  graphql`
    fragment OrderInvoice_me on User
      @argumentDefinitions(slug: { type: "Int!", defaultValue: 0 }) {
      email
      myStore {
        rawId
        order(slug: $slug) {
          id
          slug
          storeId
          product {
            baseProduct {
              rawId
              name {
                text
              }
              category {
                rawId
                name {
                  text
                  lang
                }
              }
            }
            price
            attributes {
              value
              attribute {
                name {
                  lang
                  text
                }
              }
            }
            photoMain
          }
          customer {
            firstName
            lastName
            phone
          }
          receiverName
          receiverPhone
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
          createdAt
          deliveryCompany
          trackId
          quantity
          subtotal
          state
          paymentStatus
          history {
            edges {
              node {
                state
                committedAt
                user {
                  firstName
                  lastName
                }
                comment
              }
            }
          }
        }
      }
    }
  `,
);
