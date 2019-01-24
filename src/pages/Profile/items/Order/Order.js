// @flow

import React, { PureComponent } from 'react';
import { createRefetchContainer, graphql } from 'react-relay';
import { matchShape, withRouter } from 'found';
import { pathOr } from 'ramda';

import { OrderPage } from 'pages/common/OrderPage';

import type { Order as OrderType } from './__generated__/Order_me.graphql';

type PropsType = {
  me: OrderType,
  relay: {
    refetch: Function,
  },
  match: matchShape,
};

class Order extends PureComponent<PropsType> {
  componentDidMount() {
    const orderId = pathOr(0, ['params', 'orderId'], this.props.match);
    this.props.relay.refetch(
      {
        slug: parseInt(orderId, 10),
      },
      null,
      () => {},
      { force: true },
    );
  }

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

export default createRefetchContainer(
  withRouter(Order),
  graphql`
    fragment Order_me on User
      @argumentDefinitions(slug: { type: "Int!", defaultValue: 0 }) {
      email
      order(slug: $slug) {
        id
        slug
        deliveryCompany
        storeId
        customer {
          firstName
          lastName
          phone
        }
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
  graphql`
    query Order_Query($slug: Int!) {
      me {
        ...Order_me @arguments(slug: $slug)
      }
    }
  `,
);
