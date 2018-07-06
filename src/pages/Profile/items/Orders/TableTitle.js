// @flow

import React from 'react';
import { Col } from 'layout';

import './TableTitle.scss';

const TableTitle = () => (
  <div styleName="container">
    <Col sm={6} md={3} lg={1} xl={1}>
      <span styleName="cellNumber">Number</span>
    </Col>
    <Col sm={6} md={3} lg={1} xl={1}>
      <span styleName="cellDate">Date</span>
    </Col>
    <Col sm={6} md={1} lg={1} xl={1}>
      <span styleName="cellShop">Shop</span>
    </Col>
    <Col sm={6} md={1} lg={1} xl={1}>
      <span styleName="cellDelivery">Delivery</span>
    </Col>
    <Col sm={6} md={3} lg={1} xl={1}>
      <span styleName="cellItems">Items</span>
    </Col>
    <Col sm={6} md={2} lg={1} xl={1}>
      <span styleName="cellPrice">Price</span>
    </Col>
    <Col sm={6} md={1} lg={1} xl={1}>
      <span styleName="cellPayment">Payment</span>
    </Col>
    <Col sm={6} md={1} lg={1} xl={1}>
      <span styleName="cellStatus">Status</span>
    </Col>
    <Col sm={6} md={3} lg={1} xl={2} />
    <div styleName="border" />
  </div>
);

export default TableTitle;
