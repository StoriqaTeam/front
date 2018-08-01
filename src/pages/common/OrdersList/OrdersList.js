// @flow

import React, { PureComponent } from 'react';

import { Paginator } from 'components/common/Paginator';

import type { TableItemType } from 'pages/common/OrdersList/TableRow';

import Header from './Header';
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
  onOrderDateFilterChanged: string => void,
};

class OrdersList extends PureComponent<PropsType> {
  handleSearchTermFilterChanged = (value: string) => {
    this.props.onSearchTermFilterChanged(value);
  };

  handleOrderStatusFilterChanged = (value: ?string) => {
    this.props.onOrderStatusFilterChanged(value);
  };

  handleOrderDateFilterChanged = (value: string) => {
    this.props.onOrderDateFilterChanged(value);
  };

  render() {
    return (
      <div styleName="container">
        <Header
          onSearchTermFilterChanged={this.handleSearchTermFilterChanged}
          onOrderStatusFilterChanged={this.handleOrderStatusFilterChanged}
          onOrderDateFilterChanged={this.handleOrderDateFilterChanged}
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
