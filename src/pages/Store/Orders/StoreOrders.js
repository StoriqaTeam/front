// @flow

import React, { PureComponent } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { pathOr, map, prop } from 'ramda';

import { Page } from 'components/App';
import { ManageStore } from 'pages/Manage/Store';

import type { StoreOrders_me as StoreOrdersMyStore } from './__generated__/StoreOrders_me.graphql';

type PropsType = {
  me: StoreOrdersMyStore,
};

class StoreOrders extends PureComponent<PropsType> {
  render() {
    const orders = map(
      prop('node'),
      // $FlowIgnoreMe
      pathOr([], ['myStore', 'orders', 'edges'], this.props.me),
    );
    return <div>orders here</div>;
  }
}

export default createFragmentContainer(
  Page(ManageStore(StoreOrders, 'Orders')),
  graphql`
    fragment StoreOrders_me on User {
      myStore {
        id
        rawId
        orders(currentPage: 1, itemsCount: 10, searchTermOptions: {}) {
          edges {
            node {
              slug
              id
              state
              price
              createdAt
              paymentStatus
              deliveryCompany
              product {
                baseProduct {
                  rawId
                  name {
                    lang
                    text
                  }
                }
              }
              store {
                rawId
                name {
                  lang
                  text
                }
              }
            }
          }
        }
      }
    }
  `,
);
