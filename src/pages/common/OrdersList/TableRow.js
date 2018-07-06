// @flow

import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { withRouter, routerShape, Link } from 'found';

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
  router: routerShape,
  linkFactory: (item: TableItemType) => string,
};

class TableRow extends PureComponent<PropsType> {
  render() {
    const rowItem: TableItemType = this.props.item;
    return (
      // eslint-disable-next-line
      <div
        styleName="container"
        onClick={() => this.props.router.push(this.props.linkFactory(rowItem))}
      >
        <div styleName="numberCell">{rowItem.number}</div>
        <div styleName="dateCell">{rowItem.date}</div>
        <div styleName="shopCell">{rowItem.shop.title}</div>
        <div styleName="deliveryCell">{rowItem.delivery}</div>
        <div styleName="itemCell">
          <Link to={`/store/${rowItem.shop.id}/products/${rowItem.item.id}`}>
            {rowItem.item.title}
          </Link>
        </div>
        <div styleName="priceCell">
          {rowItem.price} <b>STQ</b>
        </div>
        <div
          styleName={classNames('paymentCell', {
            paid: rowItem.payment === 'Paid',
            unpaid: rowItem.payment !== 'Paid',
          })}
        >
          {rowItem.payment}
        </div>
        <div styleName="statusCell">{rowItem.status}</div>
        <div styleName="border" />
      </div>
    );
  }
}

export default withRouter(TableRow);
