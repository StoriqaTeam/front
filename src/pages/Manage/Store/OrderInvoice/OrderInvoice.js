// @flow strict

import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
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

export default createFragmentContainer(
  OrderInvoice,
  graphql`
    fragment OrderInvoice_me on User
      @argumentDefinitions(slug: { type: "Int!", defaultValue: 0 }) {
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
