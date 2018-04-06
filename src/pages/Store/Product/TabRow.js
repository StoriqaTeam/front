// @flow

import React from 'react';

import { TabColumn } from 'pages/Store/Product';

import './TabRow.scss';

type propsTypes = {
  row: {column: {id: string | number, label: string, text: string}}[],
}

const TabRow = (props: propsTypes) => (
  <div styleName="container">
    {props.row.map(({ column }) => <TabColumn items={column} />)}
  </div>
);

export default TabRow;
