// flow@

import React from 'react';
import { withRouter, routerShape } from 'found';
import { Container, Row } from 'layout';

import { StartSellingButton } from './index';

import './StartSellingHeading.scss';

type PropsType = {
  router: routerShape,
};

const StartSellingHeading = ({ router: { push } }: PropsType) => (
  <Container>
    <Row>
      <div styleName="container">
        <h2 styleName="title">Millions of shoppers are waiting</h2>
        <div styleName="titleSpacer" />
        <p styleName="subtitle">
          Start selling now with Storiqa and see how it’s easy to trade globally
        </p>
        <div styleName="button">
          <StartSellingButton
            onClick={() => push('/manage/wizard')}
            text="Start Selling"
          />
        </div>
      </div>
    </Row>
  </Container>
);

export default withRouter(StartSellingHeading);
