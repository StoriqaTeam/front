// @flow

import React, { Component } from 'react';
import { createRefetchContainer, graphql } from 'react-relay';
import { pathOr, map } from 'ramda';

import { OrdersList } from 'pages/common/OrdersList';
import { shortDateFromTimestamp, timeFromTimestamp } from 'utils/formatDate';

import type { TableItemType } from 'pages/common/OrdersList/TableRow';

const itemsPerPage = 10;

type PropsType = {
  // eslint-disable-next-line
  data: ?{
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
};

class Orders extends Component<PropsType, StateType> {
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

  nextPage = () => {
    this.setState(
      prevState => ({
        currentPage: prevState.currentPage + 1,
      }),
      () => this.loadPage(this.state.currentPage),
    );
  };

  render() {
    // $FlowIgnoreMe
    const edges = pathOr([], ['data', 'orders', 'edges'], this.props);
    const orderDTOs = map(item => this.orderToDTO(item.node), edges);

    // $FlowIgnoreMe
    const pagesCount = pathOr(
      0,
      ['data', 'orders', 'pageInfo', 'totalPages'],
      this.props,
    );

    // $FlowIgnoreMe
    const currentPage = pathOr(
      0,
      ['data', 'orders', 'pageInfo', 'currentPage'],
      this.props,
    );
    return (
      <OrdersList
        orders={orderDTOs}
        pagesCount={pagesCount}
        currentPage={currentPage}
        onPageSelect={this.loadPage}
        linkFactory={item => `/profile/orders/${item.number}`}
      />
    );
  }
}

export default createRefetchContainer(
  Orders,
  graphql`
    fragment Orders on User
      @argumentDefinitions(
        currentPage: { type: "Int!", defaultValue: 1 }
        itemsCount: { type: "Int!", defaultValue: 10 }
      ) {
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
  `,
  graphql`
    query Orders_Query($currentPage: Int!, $itemsCount: Int!) {
      me {
        ...Orders @arguments(currentPage: $currentPage, itemsCount: $itemsCount)
      }
    }
  `,
);
