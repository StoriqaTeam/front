// @flow

import React from 'react';
import { Col } from 'layout';
import { Icon } from 'components/Icon';

import './TableTitle.scss';

const TableTitle = () => (
  <div styleName="container">
    <Col size={2} sm={4} md={3} lg={2} xl={1}>
      <span styleName="number">
        <span styleName="title">
          Number
          <Icon type="sortArrows" />
        </span>
      </span>
      <span styleName="poundSign">
        <span styleName="title">
          #
          <Icon type="sortArrows" />
        </span>
      </span>
    </Col>
    <Col size={5} sm={4} md={3} lg={3} xl={1}>
      <span styleName="title">
        Date
        <Icon type="sortArrows" />
      </span>
    </Col>
    <Col lg={2} xl={2} xlVisible>
      <span styleName="title">
        Shop
        <Icon type="sortArrows" />
      </span>
    </Col>
    <Col lg={2} xl={1} xlVisible>
      <span styleName="title">
        Delivery
        <Icon type="sortArrows" />
      </span>
    </Col>
    <Col size={5} sm={4} md={3} lg={2} xl={2}>
      <span styleName="title">
        Items
        <Icon type="sortArrows" />
      </span>
    </Col>
    <Col md={2} lg={2} xl={1} mdVisible>
      <span styleName="title">
        Price
        <Icon type="sortArrows" />
      </span>
    </Col>
    <Col md={2} lg={3} xl={2} lgVisible>
      <span styleName="title">
        Status
        <Icon type="sortArrows" />
      </span>
    </Col>
    <div styleName="border" />
  </div>
);

export default TableTitle;
