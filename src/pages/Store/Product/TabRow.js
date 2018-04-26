// @flow

import React from 'react';

import { has } from 'utils';
import { TabColumn } from './index';

import './TabRow.scss';

type PropsType = {
  row: {column: {id: string | number, label: string, text: string}}[],
}

const TabRow = (props: PropsType) => (
  <div styleName="container">
    {/* eslint-disable react/no-array-index-key */}
    {props.row.map(({ column }, index) => (
      <TabColumn
        key={has(column, 'id') ? column.id : index}
        items={column}
      />
    ))}
  </div>
);

export default TabRow;
