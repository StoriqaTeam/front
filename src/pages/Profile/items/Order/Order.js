// @flow

import React, { PureComponent } from 'react';
import { graphql, createFragmentContainer } from 'react-relay';
import { withRouter } from 'found';

import { OrderPage } from 'pages/common/OrderPage';

import type { Order as OrderType } from './__generated__/Order_me.graphql';

type PropsType = {
  me: OrderType,
};

class Order extends PureComponent<PropsType> {
  render() {
    const { order, email } = this.props.me;
    if (!order) {
      return null;
    }

    return (
      <OrderPage
        isAbleToManageOrderForUser
        order={order}
        email={email}
        isPaymentInfoCanBeShown
      />
    );
  }
}

export default createFragmentContainer(
  withRouter(Order),
  graphql`
    fragment Order_me on User
      @argumentDefinitions(slug: { type: "Int!", defaultValue: 0 }) {
      email
      order(slug: $slug) {
        id
        currency
        slug
        deliveryCompany
        storeId
        product {
          baseProduct {
            rawId
            currency
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
        preOrder
        preOrderDays
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
        totalAmount
        deliveryPrice
        couponDiscount
        state
        paymentStatus
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
      }
    }
  `,
);
