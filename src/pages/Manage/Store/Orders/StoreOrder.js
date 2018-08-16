// @flow

import React, { PureComponent } from 'react';
import { createRefetchContainer, graphql } from 'react-relay';
import { matchShape, withRouter } from 'found';
import { pathOr } from 'ramda';

import { Page } from 'components/App';
import { ManageStore } from 'pages/Manage/Store';
import { OrderPage } from 'pages/common/OrderPage';

import type { StoreOrder_me as MyStoreType } from './__generated__/StoreOrder_me.graphql';

type PropsType = {
  me: MyStoreType,
  relay: {
    refetch: Function,
  },
  match: matchShape,
};

class StoreOrder extends PureComponent<PropsType> {
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
    // $FlowIgnoreMe
    const order = pathOr(null, ['myStore', 'order'], this.props.me);
    if (!order) {
      return null;
    }

    return <OrderPage order={order} isAbleToManageOrder />;
  }
}

export default createRefetchContainer(
  Page(ManageStore(withRouter(StoreOrder), 'Orders'), true),
  graphql`
    fragment StoreOrder_me on User
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
  graphql`
    query StoreOrder_Query($slug: Int!) {
      me {
        ...StoreOrder_me @arguments(slug: $slug)
      }
    }
  `,
);
