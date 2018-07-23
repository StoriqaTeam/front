// @flow

import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { withRouter, routerShape, Link } from 'found';

import { Col } from 'layout';
import { getStatusStringFromEnum } from '../OrderPage/utils';

import { formatDate } from './OrdersListUtils';

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
  subtotal: number,
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
        <div styleName="rowWrapper">
          <Col size={2} sm={4} md={3} lg={2} xl={1}>
            {rowItem.number}
          </Col>
          <Col size={5} sm={4} md={3} lg={2} xl={1}>
            <span styleName="date">{rowItem.date}</span>
            <span styleName="dateFormatted">{formatDate(rowItem.date)}</span>
          </Col>
          <Col lg={2} xl={1} xlVisible>
            <span styleName="link">{rowItem.shop.title}</span>
          </Col>
          <Col lg={2} xl={1} xlVisible>
            {rowItem.delivery}
          </Col>
          <Col size={5} sm={4} md={3} lg={2} xl={2}>
            <span styleName="link">
              <Link
                to={`/store/${rowItem.shop.id}/products/${rowItem.item.id}`}
                onClick={(e: any) => e.stopPropagation()}
              >
                {rowItem.item.title}
              </Link>
            </span>
          </Col>
          <Col md={2} lg={2} xl={1} mdVisible>
            <span styleName="price">
              {rowItem.subtotal} <b>STQ</b>
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
            {getStatusStringFromEnum(rowItem.status)}
          </Col>
          <div styleName="border" />
        </div>
      </div>
    );
  }
}

export default withRouter(TableRow);
