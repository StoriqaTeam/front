// @flow

import React from 'react';

import { Col, Row } from 'layout';

import { StoreHeaderInfo, StoreHeaderButtons } from './index';

import './StoreHeaderBottom.scss';

const StoreHeaderBottom = () => (
  <div styleName="container">
    <Row>
      <Col sm={12} md={6} lg={5} xl={4}>
        <StoreHeaderInfo />
      </Col>
      <Col lg={2} xl={4} lgVisible />
      <Col sm={12} md={6} lg={5} xl={4}>
        <StoreHeaderButtons />
      </Col>
    </Row>
  </div>
);

export default StoreHeaderBottom;
