// @flow

import React, { PureComponent } from 'react';

import './TableRow.scss';

export type TableItemType = {
  number: string,
  date: string,
  shop: {
    id: number,
    title: string,
  },
  delivery: string,
  item: {
    id: number,
    title: string,
  },
  price: number,
  payment: string,
  status: string,
};

type PropsType = {
  item: TableItemType,
};

class TableRow extends PureComponent<PropsType> {
  render() {
    const rowItem: TableItemType = this.props.item;
    return (
      <div styleName="container">
        <div styleName="numberCell">{rowItem.number}</div>
        <div styleName="dateCell">{rowItem.date}</div>
        <div styleName="shopCell">{rowItem.shop.title}</div>
        <div styleName="deliveryCell">{rowItem.delivery}</div>
        <div styleName="itemCell">{rowItem.item.title}</div>
        <div styleName="priceCell">{rowItem.price}</div>
        <div styleName="paymentCell">{rowItem.payment}</div>
        <div styleName="statusCell">{rowItem.status}</div>
        <div styleName="border" />
      </div>
    );
  }
}

export default TableRow;
