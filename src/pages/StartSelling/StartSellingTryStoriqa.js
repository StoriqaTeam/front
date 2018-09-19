// @flow

import React from 'react';

import { Row, Col } from 'layout';

import './StartSellingTryStoriqa.scss';

const items: Array<{ id: string, title: string, text: string }> = [
  {
    id: '0',
    title: 'Low fee',
    text:
      'It doesn’t take much to list your items and once you make a sale, Storiqa’s transaction fee is just 5%.',
  },
  {
    id: '1',
    title: '24/7 customer support',
    text:
      'One of the most important aspects of running an online store is clear and quick communication with customers. We provide 24/7 customer service and online consultants in regional languages.',
  },
  {
    id: '2',
    title: 'Integrated marketing tools',
    text:
      'We provide the marketing needed to boost sales, from newsletters and CPA networks to paid advertising and many more.',
  },
  {
    id: '3',
    title: 'Payments in cryptocurrency',
    text:
      'Sellers receive payment in the currency of their choosing, including cryptocurrencies like STQ, Bitcoin, Ethereum and others. These eliminate multiple bank transaction charges and long waits to receive payments.',
  },
  {
    id: '4',
    title: 'Powerful tools',
    text:
      'We offer an efficient, simple, and powerful set of sales tools with a clear interface and thorough follow-up, all to make your goods available globally.',
  },
  {
    id: '5',
    title: 'Storiqa fulfillment center',
    text:
      'Bring your product to our center, the rest we will take care yourselves: creating a product cards, preparing promotional and marketing materials, processing orders, supporting sales.',
  },
];

const StartSellingTryStoriqa = () => (
  <div styleName="container">
    <h2 styleName="title">WHY SHOULD YOU TRY STORIQA</h2>
    <p styleName="subtitle">
      We deliver high quality services and support, including marketing
      assistance and sales advice.
    </p>
    <Row>
      <div styleName="items">
        {items.map(({ id, title, text }) => (
          <Col key={id} size={12} sm={12} md={12} lg={6} xl={6}>
            <div styleName="item">
              <h4 styleName="itemTitle">{title}</h4>
              <p styleName="itemText">{text}</p>
            </div>
          </Col>
        ))}
      </div>
    </Row>
  </div>
);

export default StartSellingTryStoriqa;
