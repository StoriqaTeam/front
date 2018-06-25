// @flow

import React from 'react';

import Header from './Header';
import TableTitle from './TableTitle';
import Table from './Table';

import tableData from './table.mock.json';

const Orders = () => (
  <div>
    <Header />
    <TableTitle />
    <Table items={tableData} />
  </div>
);

export default Orders;
