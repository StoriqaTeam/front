// @flow

import React from 'react';

import { Paginator } from 'components/common/Paginator';

import type { TableItemType } from 'pages/common/OrdersList/TableRow';

import Header from './Header';
import TableTitle from './TableTitle';
import Table from './Table';

type PropsType = {
  orders: Array<TableItemType>,
  currentPage: number,
  pagesCount: number,
  onPageSelect: (pageNumber: number) => void,
};

const OrdersList = (props: PropsType) => (
  <div>
    <Header />
    <TableTitle />
    <Table items={props.orders} />
    <Paginator
      pagesCount={props.pagesCount}
      currentPage={props.currentPage}
      onPageSelect={props.onPageSelect}
    />
  </div>
);

export default OrdersList;
