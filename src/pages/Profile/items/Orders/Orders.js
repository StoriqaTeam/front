// @flow

import React, { Component } from 'react';
import { createRefetchContainer, graphql } from 'react-relay';
import { pathOr, map, isEmpty } from 'ramda';
import moment from 'moment';

import { OrdersList } from 'pages/common/OrdersList';

import type { TableItemType } from 'pages/common/OrdersList/TableRow';

import '../../Profile.scss';

import t from './i18n';

const itemsPerPage = 10;

type PropsType = {
  // eslint-disable-next-line
  me: ?{
    orders: ?{
      edges: Array<any>,
      pageInfo: {
        totalPages: number,
        currentPage: number,
        pageItemsCount: number,
      },
    },
  },
  relay: {
    refetch: Function,
  },
};

type StateType = {
  currentPage: number,
  searchTerm: ?string,
  orderFromDate: ?string,
  orderToDate: ?string,
  orderStatus: ?string,
  isLoadingPagination: boolean,
};

class Orders extends Component<PropsType, StateType> {
  state: StateType = {
    currentPage: 1,
    searchTerm: null,
    orderFromDate: null,
    orderToDate: null,
    orderStatus: null,
    isLoadingPagination: false,
  };

  componentDidMount() {
    this.loadPage(this.state.currentPage);
  }

  loadPage = (pageNumber: number) => {
    this.setState({ isLoadingPagination: true });
    this.props.relay.refetch(
      {
        currentPage: pageNumber,
        itemsCount: itemsPerPage,
        searchTermOptions: {
          slug: isEmpty(this.state.searchTerm)
            ? null
            : parseInt(this.state.searchTerm, 10),
          createdFrom:
            this.state.orderFromDate && moment(this.state.orderFromDate).utc(),
          createdTo:
            this.state.orderToDate && moment(this.state.orderToDate).utc(),
          orderStatus: this.state.orderStatus,
        },
      },
      null,
      () => {
        this.setState({ isLoadingPagination: false });
      },
      { force: true },
    );
  };

  // I'm so sorry for this shit, guys (`order: { [string]: any }`)
  orderToDTO = (order: { [string]: any }): TableItemType => {
    const result: TableItemType = {
      number: `${order.slug}`,
      date: order.createdAt,
      shop: {
        id: order.store ? order.store.rawId : null,
        title: order.store ? order.store.name[0].text : t.theStoreWasDeleted,
      },
      delivery: order.deliveryCompany,
      item: {
        id:
          order.product && order.product.baseProduct
            ? order.product.baseProduct.rawId
            : null,
        title:
          order.product && order.product.baseProduct
            ? order.product.baseProduct.name[0].text
            : t.theProductWasDeleted,
      },
      price: order.price,
      payment: order.paymentStatus ? t.paid : t.notPaid,
      status: order.state,
      subtotal: order.subtotal,
      totalAmount: order.totalAmount,
      currency: order.currency,
    };
    return result;
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

  handleOrderFromDateFilterChanged = (value: string) => {
    this.setState({ orderFromDate: `${value}T00:00:00+00:00` }, () => {
      this.loadPage(this.state.currentPage);
    });
  };

  handleOrderToDateFilterChanged = (value: string) => {
    this.setState({ orderToDate: `${value}T23:59:59+00:00` }, () => {
      this.loadPage(this.state.currentPage);
    });
  };

  render() {
    // $FlowIgnoreMe
    const edges = pathOr([], ['me', 'orders', 'edges'], this.props);
    const orderDTOs = map(item => this.orderToDTO(item.node), edges);
    const { isLoadingPagination } = this.state;

    // $FlowIgnoreMe
    const pagesCount = pathOr(
      0,
      ['me', 'orders', 'pageInfo', 'totalPages'],
      this.props,
    );

    // $FlowIgnoreMe
    const currentPage = pathOr(
      0,
      ['me', 'orders', 'pageInfo', 'currentPage'],
      this.props,
    );
    return (
      <div styleName="ordersList">
        <OrdersList
          orders={orderDTOs}
          pagesCount={pagesCount}
          currentPage={currentPage}
          onPageSelect={this.loadPage}
          isLoadingPagination={isLoadingPagination}
          linkFactory={item => `/profile/orders/${item.number}`}
          onSearchTermFilterChanged={this.handleSearchTermFilterChanged}
          onOrderStatusFilterChanged={this.handleOrderStatusFilterChanged}
          onOrderFromDateFilterChanged={this.handleOrderFromDateFilterChanged}
          onOrderToDateFilterChanged={this.handleOrderToDateFilterChanged}
        />
      </div>
    );
  }
}

export default createRefetchContainer(
  Orders,
  graphql`
    fragment Orders_me on User
      @argumentDefinitions(
        currentPage: { type: "Int!", defaultValue: 1 }
        itemsCount: { type: "Int!", defaultValue: 10 }
        searchTermOptions: { type: "SearchOrderOptionInput!", defaultValue: {} }
      ) {
      orders(
        currentPage: $currentPage
        itemsCount: $itemsCount
        searchTermOptions: $searchTermOptions
      ) {
        edges {
          node {
            currency
            slug
            id
            state
            price
            quantity
            subtotal
            createdAt
            paymentStatus
            deliveryCompany
            totalAmount
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
  `,
  graphql`
    query Orders_Query(
      $currentPage: Int!
      $itemsCount: Int!
      $searchTermOptions: SearchOrderOptionInput!
    ) {
      me {
        ...Orders_me
          @arguments(
            currentPage: $currentPage
            itemsCount: $itemsCount
            searchTermOptions: $searchTermOptions
          )
      }
    }
  `,
);
