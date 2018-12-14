// @flow

import React from 'react';

import { Col } from 'layout';

import { StoreHeaderInfo } from '../index';

import './StoreHeaderBottom.scss';

const StoreHeaderBottom = () => (
  <div styleName="container">
    <Col sm={12} md={7} lg={8} xl={8}>
      <StoreHeaderInfo />
    </Col>
    <Col sm={12} md={5} lg={4} xl={4} />
  </div>
);

export default StoreHeaderBottom;
