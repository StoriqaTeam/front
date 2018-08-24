// @flow

import React from 'react';

import hit from './img/hit.png';
import bestChoice from './img/best-choice.png';

import './StartSellingPrices.scss';

type PriceType = {
  id: string,
  title: string,
  price: string,
  plan: number,
  includes: Array<string>,
  icon: ?string,
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
    ],
    icon: null,
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
    ],
    icon: 'hit',
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
      'Built-in telephone service',
      'Chat',
      'Mailing services',
      'Callback',
    ],
    icon: 'bestChoice',
  },
];

const StartSellingPrices = () => (
  <div styleName="container">
    <h2 styleName="title">Low fee & high transparency</h2>
    <p styleName="subtitle">
      We deliver high quality services and support, including marketing
      assistance and sales advice.
    </p>
    <div styleName="items">
      {items.map(({ id, price, title, plan, includes, icon }) => (
        <div styleName="item" key={id}>
          <h4 styleName="itemTitle">
            {icon && (<img src={icon === 'hit' ? hit : bestChoice} alt="" styleName={icon} />)}
            {title}
          </h4>
          <div styleName="planBadge">
            <div styleName="number">
              {plan}
            </div>
            <div>
              <div styleName="stq">
                STQ 
              </div>
              <div styleName="price">
                {price}
              </div>
            </div>
          </div>
          <p styleName="itemSubtitle">per product per day</p>
          <ul>
            {includes.map(name => (
              <li key={name} styleName="detail">{name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
);

export default StartSellingPrices;
