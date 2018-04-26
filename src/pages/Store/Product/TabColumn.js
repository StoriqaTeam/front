// @flow

import React from 'react';

import { has } from 'utils';
import './TabColumn.scss';

type PropsType = {
  items: {id: string | number, label: string, text: string}[],
}

const TabColumn = (props: PropsType) => (
  <div styleName="container">
    {props.items.map((row, index) => (
      <div
        key={has(row, 'id') ? row.id : index}
        styleName="columnItem"
      >
        <h6>{ row.label }</h6>
        <small>{ row.text }</small>
      </div>
    ))}
  </div>
);

export default TabColumn;
