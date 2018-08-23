// @flow

import React, { Fragment } from 'react';

import { Row, Col } from 'layout';

import computerImage from './img/storiqa-computer-market.png';

import './StartSellingMarket.scss';

const StartSellingMarket = () => (
  <div styleName="container">
    <h2 styleName="title">STORIQA IS YOUR DOOR TO GLOBAL MARKET</h2>
    <p styleName="subtitle">
      Our goal is to guarantee the quality of experience and goods, for both
      buyers and sellers.
    </p>
    <Row>
      <Col size={12} sm={12} md={6} lg={6} xl={6}>
        <article styleName="parragraphs">
          <p>
            Storiqa is an online marketplace offering global access with minimal
            financial borders and global transactional fees. We’re committed to
            helping our sellers thrive. Our goal is to guarantee the quality of
            experience and goods, for both buyers and sellers.
          </p>
          <p>
            Key platform features such as inclusive advertising and promotion,
            sales analysis, book-keeping and direct customer feedback make
            Storiqa ideal for entrepreneurs, small-scale manufacturers, family
            businesses and makers of handmade crafts.
          </p>
        </article>
      </Col>
      <Col size={12} sm={12} md={6} lg={6} xl={6}>
        <div styleName="imageContainer">
          <img src={computerImage} alt="storiqa market" />
        </div>
      </Col>
    </Row>
  </div>
);

export default StartSellingMarket;
