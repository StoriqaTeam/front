// @flow

import React, { PureComponent } from 'react';
import { withRouter, routerShape, Link } from 'found';

import { Col } from 'layout';
import { getStatusStringFromEnum } from '../OrderPage/utils';

import { formatDate } from './OrdersListUtils';

import './TableRow.scss';

export type TableItemType = {
  number: string,
  date: string,
  shop: {
    id: ?number,
    title: string,
  },
  delivery: string,
  item: {
    id: ?number,
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
          <Col size={5} sm={4} md={3} lg={3} xl={1}>
            <span styleName="date">{rowItem.date}</span>
            <span styleName="dateFormatted">{formatDate(rowItem.date)}</span>
          </Col>
          <Col lg={2} xl={2} xlVisible>
            <span styleName="link">
              {rowItem.shop.id ? (
                <Link
                  to={`/store/${rowItem.shop.id}`}
                  onClick={(e: any) => e.stopPropagation()}
                >
                  {rowItem.shop.title}
                </Link>
              ) : (
                <span styleName="noLink">{rowItem.shop.title}</span>
              )}
            </span>
          </Col>
          <Col lg={2} xl={1} xlVisible>
            {rowItem.delivery}
          </Col>
          <Col size={5} sm={4} md={3} lg={2} xl={2}>
            <span styleName="link">
              {rowItem.item.id ? ( // eslint-disable-line
                rowItem.shop.id ? (
                  <Link
                    to={`/store/${rowItem.shop.id}/products/${rowItem.item.id}`}
                    onClick={(e: any) => e.stopPropagation()}
                  >
                    {rowItem.item.title}
                  </Link>
                ) : (
                  <div styleName="noLink">{rowItem.item.title}</div>
                )
              ) : (
                <span styleName="noLink">{rowItem.item.title}</span>
              )}
            </span>
          </Col>
          <Col md={2} lg={2} xl={1} mdVisible>
            <span styleName="price">
              {rowItem.subtotal} <b>STQ</b>
            </span>
          </Col>
          <Col md={2} lg={3} xl={2} lgVisible>
            {getStatusStringFromEnum(rowItem.status)}
          </Col>
          <div styleName="border" />
        </div>
      </div>
    );
  }
}

export default withRouter(TableRow);
