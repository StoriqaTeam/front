// @flow

import React, { PureComponent } from 'react';

import { Paginator } from 'components/common/Paginator';

import type { TableItemType } from 'pages/common/OrdersList/TableRow';

import OrdersListHeader from './OrdersListHeader';
import TableTitle from './TableTitle';
import Table from './Table';

import './OrdersList.scss';

type PropsType = {
  orders: Array<TableItemType>,
  currentPage: number,
  pagesCount: number,
  onPageSelect: (pageNumber: number) => void,
  linkFactory: (item: TableItemType) => string,
  onSearchTermFilterChanged: string => void,
  onOrderStatusFilterChanged: (?string) => void,
  onOrderFromDateFilterChanged: string => void,
  onOrderToDateFilterChanged: string => void,
};

class OrdersList extends PureComponent<PropsType> {
  handleSearchTermFilterChanged = (value: string) => {
    this.props.onSearchTermFilterChanged(value);
  };

  handleOrderStatusFilterChanged = (value: ?string) => {
    this.props.onOrderStatusFilterChanged(value);
  };

  handleOrderFromDateFilterChanged = (value: string) => {
    this.props.onOrderFromDateFilterChanged(value);
  };

  handleOrderToDateFilterChanged = (value: string) => {
    this.props.onOrderToDateFilterChanged(value);
  };

  render() {
    return (
      <div styleName="container">
        <OrdersListHeader
          onSearchTermFilterChanged={this.handleSearchTermFilterChanged}
          onOrderStatusFilterChanged={this.handleOrderStatusFilterChanged}
          onOrderFromDateFilterChanged={this.handleOrderFromDateFilterChanged}
          onOrderToDateFilterChanged={this.handleOrderToDateFilterChanged}
        />
        <TableTitle />
        <Table items={this.props.orders} linkFactory={this.props.linkFactory} />
        <Paginator
          pagesCount={this.props.pagesCount}
          currentPage={this.props.currentPage}
          onPageSelect={this.props.onPageSelect}
        />
      </div>
    );
  }
}

export default OrdersList;
