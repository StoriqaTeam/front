// @flow

import React from 'react';
import { Col } from 'layout';

import './TableTitle.scss';

const TableTitle = () => (
  <div styleName="container">
    <Col size={2} sm={4} md={3} lg={2} xl={1}>
      <span styleName="number">Number</span>
      <span styleName="poundSign">#</span>
    </Col>
    <Col size={5} sm={4} md={3} lg={2} xl={1}>
      Date
    </Col>
    <Col lg={2} xl={1} xlVisible>
      Shop
    </Col>
    <Col lg={2} xl={1} xlVisible>
      Delivery
    </Col>
    <Col size={5} sm={4} md={3} lg={2} xl={2}>
      Items
    </Col>
    <Col md={2} lg={2} xl={1} mdVisible>
      Price
    </Col>
    <Col md={1} lg={2} xl={1} lgVisible>
      Payment
    </Col>
    <Col md={1} lg={2} xl={2} lgVisible>
      Status
    </Col>
    <div styleName="border" />
  </div>
);

export default TableTitle;
