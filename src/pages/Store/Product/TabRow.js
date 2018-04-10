// @flow

import React from 'react';

import { TabColumn } from './index';

import './TabRow.scss';

type PropsType = {
  row: {column: {id: string | number, label: string, text: string}}[],
}

const TabRow = (props: PropsType) => (
  <div styleName="container">
    {props.row.map(({ column }) => <TabColumn items={column} />)}
  </div>
);

export default TabRow;
