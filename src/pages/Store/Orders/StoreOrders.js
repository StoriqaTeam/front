// @flow

import React, { Component } from 'react';
import { createRefetchContainer, graphql } from 'react-relay';
import { pathOr, map, prop } from 'ramda';

import { Page } from 'components/App';
import { ManageStore } from 'pages/Manage/Store';
import { OrdersList } from 'pages/common/OrdersList';
import { shortDateFromTimestamp, timeFromTimestamp } from 'utils/formatDate';

import type { TableItemType } from 'pages/common/OrdersList/TableRow';

import type { StoreOrders_me as StoreOrdersMyStore } from './__generated__/StoreOrders_me.graphql';

const itemsPerPage = 10;

type PropsType = {
  me: StoreOrdersMyStore,
  relay: {
    refetch: Function,
  },
};

type StateType = {
  currentPage: number,
};

class StoreOrders extends Component<PropsType, StateType> {
  state: StateType = {
    currentPage: 1,
  };

  componentDidMount() {
    this.loadPage(this.state.currentPage);
  }

  loadPage = (pageNumber: number) => {
    this.props.relay.refetch(
      {
        currentPage: pageNumber,
        itemsCount: itemsPerPage,
      },
      null,
      () => {},
      { force: true },
    );
  };

  // I'm so sorry for this shit, guys (`order: { [string]: any }`)
  orderToDTO = (order: { [string]: any }): TableItemType => {
    const result: TableItemType = {
      number: `${order.slug}`,
      date: this.compileDateString(order.createdAt),
      shop: {
        id: order.store.rawId,
        title: order.store.name[0].text,
      },
      delivery: order.deliveryCompany,
      item: {
        id: order.product.baseProduct.rawId,
        title: order.product.baseProduct.name[0].text,
      },
      price: order.price,
      payment: order.paymentStatus ? 'Paid' : 'Not paid',
      status: order.state,
    };
    return result;
  };

  compileDateString = (timestamp: string): string => {
    const shortDate = shortDateFromTimestamp(timestamp);
    const time = timeFromTimestamp(timestamp);
    return `${shortDate}\n${time}`;
  };

  render() {
    const edges = map(
      prop('node'),
      // $FlowIgnoreMe
      pathOr([], ['myStore', 'orders', 'edges'], this.props.me),
    );
    const orderDTOs = map(this.orderToDTO, edges);

    // $FlowIgnoreMe
    const pagesCount = pathOr(
      0,
      ['myStore', 'orders', 'pageInfo', 'totalPages'],
      this.props.me,
    );

    // $FlowIgnoreMe
    const currentPage = pathOr(
      0,
      ['myStore', 'orders', 'pageInfo', 'currentPage'],
      this.props.me,
    );

    return (
      <OrdersList
        orders={orderDTOs}
        pagesCount={pagesCount}
        currentPage={currentPage}
        onPageSelect={this.loadPage}
      />
    );
  }
}

export default createRefetchContainer(
  Page(ManageStore(StoreOrders, 'Orders')),
  graphql`
    fragment StoreOrders_me on User
      @argumentDefinitions(
        currentPage: { type: "Int!", defaultValue: 1 }
        itemsCount: { type: "Int!", defaultValue: 10 }
      ) {
      myStore {
        id
        rawId
        orders(
          currentPage: $currentPage
          itemsCount: $itemsCount
          searchTermOptions: {}
        ) {
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
          pageInfo {
            totalPages
            currentPage
            pageItemsCount
          }
        }
      }
    }
  `,
  graphql`
    query StoreOrders_Query($currentPage: Int!, $itemsCount: Int!) {
      me {
        ...StoreOrders_me
          @arguments(currentPage: $currentPage, itemsCount: $itemsCount)
      }
    }
  `,
);
