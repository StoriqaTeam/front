// @flow

import React, { PureComponent } from 'react';
import { graphql, createFragmentContainer } from 'react-relay';
import { withRouter } from 'found';
import { pathOr } from 'ramda';

import { Page } from 'components/App';
import { ManageStore } from 'pages/Manage/Store';
import { OrderPage } from 'pages/common/OrderPage';

import type { StoreOrder_me as MyStoreType } from './__generated__/StoreOrder_me.graphql';

type PropsType = {
  me: MyStoreType,
};

class StoreOrder extends PureComponent<PropsType> {
  render() {
    // $FlowIgnoreMe
    const order = pathOr(null, ['myStore', 'order'], this.props.me);
    if (!order) {
      return null;
    }

    return <OrderPage order={order} isAbleToManageOrder showInvoice />;
  }
}

export default createFragmentContainer(
  Page(
    withRouter(
      ManageStore({
        OriginalComponent: StoreOrder,
        active: 'orders',
        title: 'Orders',
      }),
    ),
  ),
  graphql`
    fragment StoreOrder_me on User
      @argumentDefinitions(slug: { type: "Int!", defaultValue: 0 }) {
      myStore {
        rawId
        order(slug: $slug) {
          id
          currency
          slug
          deliveryCompany
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
          totalAmount
          deliveryPrice
          couponDiscount
          history {
            edges {
              node {
                state
                committedAt
                committerRole
                comment
              }
            }
          }
          fee {
            id
            orderId
            amount
            status
            currency
            chargeId
          }
          orderBilling {
            id
            state
            stripeFee
            sellerCurrency
          }
        }
      }
    }
  `,
);
