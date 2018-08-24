// @flow

import React from 'react';

import { FooterResponsive } from 'components/App';
import { Container, Row, Col } from 'layout';

import {
  StartSellingHeader,
  StartSellingMarket,
  StartSellingForSellers,
  StartSellingTryStoriqa,
  StartSellingPrices,
  StartSellingFAQ,
} from './index';

import './StartSelling.scss';

const StartSelling = () => (
  <Container>
    <div styleName="container">
      <Row>
        <Col size={1} />
        <Col size={12} sm={12} md={12} lg={10} xl={10}>
          <StartSellingHeader />
          <StartSellingMarket />
          <StartSellingTryStoriqa />
          <StartSellingForSellers />
          <StartSellingPrices />
          <StartSellingFAQ />
          <FooterResponsive />
        </Col>
        <Col size={1} />
      </Row>
    </div>
  </Container>
);

export default StartSelling;
