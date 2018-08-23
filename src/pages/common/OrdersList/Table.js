// @flow

import React, { PureComponent, Fragment } from 'react';
import { map, isEmpty } from 'ramda';

import TableRow from './TableRow';

import type { TableItemType } from './TableRow';

import './Table.scss';

type PropsType = {
  items: Array<TableItemType>,
  linkFactory: (item: TableItemType) => string,
};

class Table extends PureComponent<PropsType> {
  renderItems = (items: Array<TableItemType>) =>
    map(
      item => (
        <TableRow
          key={item.number}
          item={item}
          linkFactory={this.props.linkFactory}
        />
      ),
      items,
    );

  render() {
    const { items } = this.props;
    return (
      <Fragment>
        {items && !isEmpty(items) ? (
          <div>{this.renderItems(items)}</div>
        ) : (
          <div styleName="noOrders">No orders</div>
        )}
      </Fragment>
    );
  }
}

export default Table;
