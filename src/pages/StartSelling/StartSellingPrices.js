// @flow

import React from 'react';

import { Row, Col } from 'layout';

import './StartSellingPrices.scss';

type PriceType = { 
  id: string,
  title: string,
  price: string,
  plan: number,
  includes: Array<string>, 
};

const items: Array<PriceType> = [
  {
    id: '0',
    title: 'Standard',
    price: '=$0.03',
    plan: 1,
    includes: [
      'Online shop with catalog',
      'Hosting',
      'Discount system',
      '24/7 support',
    ]
  },
  {
    id: '1',
    title: 'E-commerce',
    price: '=$0.06',
    plan: 2,
    includes: [
      'Online shop with catalog',
      'Hosting',
      'Discount system',
      '24/7 support',
      'Online card payments',
    ]
  },
  {
    id: '2',
    title: 'Fulfillment',
    price: '=$0.06',
    plan: 3,
    includes: [
      'Online shop with catalog',
      'Hosting',
      'Discount system',
      '24/7 support',
      'Online card payments',
    ]
  },
];

const StartSellingPrices = () => (
  <div styleName="container">
    <h2 styleName="title">WHY SHOULD YOU TRY STORIQA</h2>
    <p styleName="subtitle">
      We deliver high quality services and support, including marketing assistance and sales advice.
    </p>
    <Row>
      <div styleName="items">
        {items.map(({ id, title, plan, includes }) => (
          <div styleName="item" key={id}>
            <h4 styleName="itemTitle">{title}</h4>
            <div styleName="price">
              <div styleName="number">
                {plan}
              </div>
            </div>
            <p styleName="itemSubtitle">
              per product 
              per day
            </p>
            <ul>
              {includes.map(name => (
                <li key={name}>
                  {name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Row>
  </div>
);

export default StartSellingPrices;
