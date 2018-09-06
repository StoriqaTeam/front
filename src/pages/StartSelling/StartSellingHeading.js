// flow@

import React from 'react';
import { Container, Row } from 'layout';

import { StartSellingButton } from './index';

import './StartSellingHeading.scss';

class StartSellingHeading extends React.PureComponent<{}> {
  goToWizard = () => {
    // I have no idea why `router.push || router.replace` doesnt make transition
    window.location.href = '/manage/wizard?step=1';
  };

  render() {
    return (
      <Container>
        <Row>
          <div styleName="container">
            <h2 styleName="title">Millions of shoppers are waiting</h2>
            <div styleName="titleSpacer" />
            <p styleName="subtitle">
              Start selling now with Storiqa and see how it’s easy to trade
              globally
            </p>
            <div styleName="button">
              <StartSellingButton
                onClick={this.goToWizard}
                text="Start Selling"
              />
            </div>
          </div>
        </Row>
      </Container>
    );
  }
}

export default StartSellingHeading;
