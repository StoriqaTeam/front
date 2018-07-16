// @flow

import React, { PureComponent } from 'react';
import { createRefetchContainer, graphql } from 'react-relay';
import { matchShape, withRouter } from 'found';
import { pathOr } from 'ramda';

import { OrderPage } from 'pages/common/OrderPage';

import type { Order as OrderType } from './__generated__/Order.graphql';

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
    const { order } = this.props.me;
    if (!order) {
      return null;
    }

    return <OrderPage order={order} />;
  }
}

export default createRefetchContainer(
  withRouter(Order),
  graphql`
    fragment Order on User
      @argumentDefinitions(slug: { type: "Int!", defaultValue: 0 }) {
      order(slug: $slug) {
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
        receiverName
        addressFull {
          value
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
  `,
  graphql`
    query Order_Query($slug: Int!) {
      me {
        ...Order @arguments(slug: $slug)
      }
    }
  `,
);
