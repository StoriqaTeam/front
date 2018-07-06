// @flow

import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { withRouter, routerShape, Link } from 'found';

import { Col } from 'layout';

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
};

class TableRow extends PureComponent<PropsType> {
  render() {
    const rowItem: TableItemType = this.props.item;
    return (
      // eslint-disable-next-line
      <div
        styleName="container"
        onClick={() =>
          this.props.router.push(`/profile/orders/${rowItem.number}`)
        }
      >
        <Col sm={6} md={3} lg={1} xl={1}>
          <div styleName="numberCell">{rowItem.number}</div>
        </Col>
        <Col sm={6} md={3} lg={1} xl={1}>
          <div styleName="dateCell">{rowItem.date}</div>
        </Col>
        <Col sm={1} md={1} lg={1} xl={1} lgVisible>
          <div styleName="shopCell">{rowItem.shop.title}</div>
        </Col>
        <Col sm={1} md={1} lg={1} xl={1}>
          <div styleName="deliveryCell">{rowItem.delivery}</div>
        </Col>
        <Col sm={3} md={3} lg={1} xl={1}>
          <div styleName="itemCell">
            <Link to={`/store/${rowItem.shop.id}/products/${rowItem.item.id}`}>
              {rowItem.item.title}
            </Link>
          </div>
        </Col>
        <Col sm={3} md={2} lg={1} xl={1}>
          <div styleName="priceCell">
            {rowItem.price} <b>STQ</b>
          </div>
        </Col>
        <Col sm={6} md={1} lg={1} xl={1}>
          <div
            styleName={classNames('paymentCell', {
              paid: rowItem.payment === 'Paid',
              unpaid: rowItem.payment !== 'Paid',
            })}
          >
            {rowItem.payment}
          </div>
        </Col>
        <Col sm={6} md={1} lg={1} xl={1}>
          <div styleName="statusCell">{rowItem.status}</div>
        </Col>
        <div styleName="border" />
      </div>
    );
  }
}

export default withRouter(TableRow);
