// @flow

import React from 'react';

import { Row, Col } from 'layout';

import forSellersImage from './img/storiqa-for-sellers.png';

import './StartSellingForSellers.scss';

const items: Array<{ id: string, title: string, text: string }> = [
  {
    id: '0',
    title: 'CRM Analytics',
    text:
      'Manage your store, sales, employees, warehouses in a convenient interface anywhere in the world. Get statistics and analytics online',
  },
  {
    id: '1',
    title: 'CPA networks',
    text:
      'Use our CPA network in order to advertise your products and increase sales',
  },
  {
    id: '2',
    title: 'Mobile Wallet',
    text:
      'Track all cash inflows in a convenient mobile application, convert and withdraw funds',
  },
];

const StartSellingForSellers = () => (
  <div styleName="container">
    <Row>
      <Col size={12} sm={12} md={12} lg={6} xl={6}>
        <h2 styleName="title">
          Storiqa is a real swiss army knife for SELLERS
        </h2>
        <p styleName="subtitle">
          Spend less time managing your shop. Our tools will allow you to
          efficiently manage sales around the world
        </p>
        {items.map(({ id, title, text }) => (
          <div styleName="item" key={id}>
            <h4 styleName="itemTitle">{title}</h4>
            <p styleName="itemText">{text}</p>
          </div>
        ))}
      </Col>
      <Col size={12} sm={12} md={12} lg={6} xl={6}>
        <div styleName="imageContainer">
          <img src={forSellersImage} alt="storiqa market" />
        </div>
      </Col>
    </Row>
  </div>
);

export default StartSellingForSellers;
