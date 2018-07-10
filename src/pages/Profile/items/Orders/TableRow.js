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
        <Col size={2} sm={4} md={3} lg={2} xl={1}>
          {rowItem.number}
        </Col>
        <Col size={5} sm={4} md={3} lg={2} xl={1}>
          <span styleName="date">{rowItem.date}</span>
          <span styleName="dateFormatted">11/11/2018</span>
        </Col>
        <Col lg={2} xl={1} xlVisible>
          {rowItem.shop.title}
        </Col>
        <Col lg={2} xl={1} xlVisible>
          {rowItem.delivery}
        </Col>
        <Col size={5} sm={4} md={3} lg={2} xl={2}>
          <Link to={`/store/${rowItem.shop.id}/products/${rowItem.item.id}`}>
            {rowItem.item.title}
          </Link>
        </Col>
        <Col md={2} lg={2} xl={1} mdVisible>
          <span styleName="price">
            {rowItem.price} <b>STQ</b>
          </span>
        </Col>
        <Col lg={2} xl={1} lgVisible>
          <div
            styleName={classNames({
              paid: rowItem.payment === 'Paid',
              unpaid: rowItem.payment !== 'Paid',
            })}
          >
            {rowItem.payment}
          </div>
        </Col>
        <Col lg={2} xl={2} lgVisible>
          {rowItem.status}
        </Col>
        <div styleName="border" />
      </div>
    );
  }
}

export default withRouter(TableRow);
