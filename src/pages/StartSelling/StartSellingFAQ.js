// @flow

import React from 'react';
import { withRouter, routerShape } from 'found';

import { Row, Col } from 'layout';

import { StartSellingButton } from './index';

import './StartSellingFAQ.scss';

type PropsType = {
  router: routerShape,
};

const faqs: Array<string> = [
  'What is Storiqa marketplace?',
  'What kind of goods will I be able to sell on Storiqa platform?',
  'What countries will I be able to send my goods to?',
  'What currencies will I be able to sell my goods with?',
  'What is STQ token and how can I conver it to fiat currency?',
];

const StartSellingFAQ = ({ router: { push } }: PropsType) => (
  <div styleName="container">
    <h2 styleName="title">
      FREQUENTLY <br />
      ASKED QUESTIONS
    </h2>
    <p styleName="subtitle">
      Here are some common questions about selling on Storiqa.
    </p>
    <ul styleName="faqs">
      {faqs.map(faq => (
        <li key={faq} styleName="faq">
          <span styleName="plus">+</span> {faq}
        </li>
      ))}
    </ul>
    <Row>
      <Col size={12} sm={12} md={12} lg={7} xl={7}>
        <h3 styleName="ready">Ready to open your store?</h3>
      </Col>
      <Col size={12} sm={12} md={12} lg={5} xl={5}>
        <div styleName="button">
          <StartSellingButton
            text="Start selling  with Storiqa"
            onClick={() => push('/manage/wizard')}
          />
        </div>
      </Col>
    </Row>
  </div>
);

export default withRouter(StartSellingFAQ);
