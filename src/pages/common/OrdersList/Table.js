// @flow

import React, { PureComponent } from 'react';
import { map } from 'ramda';

import TableRow from './TableRow';

import type { TableItemType } from './TableRow';

type PropsType = {
  items: Array<TableItemType>,
};

class Table extends PureComponent<PropsType> {
  renderItems = (items: Array<TableItemType>) =>
    map(item => <TableRow key={item.number} item={item} />, items);

  render() {
    return <div>{this.renderItems(this.props.items)}</div>;
  }
}

export default Table;