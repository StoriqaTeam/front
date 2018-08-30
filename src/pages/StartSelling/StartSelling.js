// @flow

import React from 'react';

import { FooterResponsive } from 'components/App';
import { Container, Row, Col } from 'layout';

import {
  StartSellingHeader,
  StartSellingHeading,
  StartSellingMarket,
  StartSellingForSellers,
  StartSellingTryStoriqa,
  StartSellingPrices,
  StartSellingFAQ,
} from './index';

import './StartSelling.scss';

const StartSelling = () => (
  <div styleName="container">
    <Container>
      <StartSellingHeader />
      <div styleName="wrapper">
        <Row>
          <Col size={1} />
          <Col size={12} sm={12} md={12} lg={10} xl={10}>
            <StartSellingHeading />
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
  </div>
);

export default StartSelling;
