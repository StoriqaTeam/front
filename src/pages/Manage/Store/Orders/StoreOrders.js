// @flow

import React, { Component } from 'react';
import { createRefetchContainer, graphql } from 'react-relay';
import { pathOr, map, prop, isEmpty } from 'ramda';
import moment from 'moment';

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
  searchTerm: ?string,
  orderDate: ?string,
  orderStatus: ?string,
};

class StoreOrders extends Component<PropsType, StateType> {
  state: StateType = {
    currentPage: 1,
    searchTerm: null,
    orderDate: null,
    orderStatus: null,
  };

  componentDidMount() {
    this.loadPage(this.state.currentPage);
  }

  loadPage = (pageNumber: number) => {
    this.props.relay.refetch(
      {
        currentPage: pageNumber,
        itemsCount: itemsPerPage,
        searchTermOptions: {
          slug: isEmpty(this.state.searchTerm)
            ? null
            : parseInt(this.state.searchTerm, 10),
          createdFrom:
            this.state.orderDate && moment(this.state.orderDate).utc(),
          createdTo:
            this.state.orderDate &&
            moment(this.state.orderDate)
              .utc()
              .add(1, 'd'),
          orderStatus: this.state.orderStatus,
        },
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

  handleSearchTermFilterChanged = (value: string) => {
    this.setState({ searchTerm: value }, () => {
      this.loadPage(this.state.currentPage);
    });
  };

  handleOrderStatusFilterChanged = (value: ?string) => {
    this.setState({ orderStatus: value }, () => {
      this.loadPage(this.state.currentPage);
    });
  };

  handleOrderDateFilterChanged = (value: string) => {
    this.setState({ orderDate: value }, () => {
      this.loadPage(this.state.currentPage);
    });
  };

  render() {
    // $FlowIgnoreMe
    const storeId = pathOr(null, ['match', 'params', 'storeId'], this.props);
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
        linkFactory={item => `/manage/store/${storeId}/orders/${item.number}`}
        onSearchTermFilterChanged={this.handleSearchTermFilterChanged}
        onOrderStatusFilterChanged={this.handleOrderStatusFilterChanged}
        onOrderDateFilterChanged={this.handleOrderDateFilterChanged}
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
        searchTermOptions: { type: "SearchOrderOptionInput!", defaultValue: {} }
      ) {
      myStore {
        id
        rawId
        orders(
          currentPage: $currentPage
          itemsCount: $itemsCount
          searchTermOptions: $searchTermOptions
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
    query StoreOrders_Query(
      $currentPage: Int!
      $itemsCount: Int!
      $searchTermOptions: SearchOrderOptionInput!
    ) {
      me {
        ...StoreOrders_me
          @arguments(
            currentPage: $currentPage
            itemsCount: $itemsCount
            searchTermOptions: $searchTermOptions
          )
      }
    }
  `,
);
