// @flow

import React from 'react';

import { Icon } from 'components/Icon';
import { Button } from 'components/common/Button';
import { Container, Col, Row } from 'layout';

import './WizardFooter.scss';

const WizardFooter = ({
  currentStep,
  onChangeStep,
  onSaveStep,
  isReadyToNext,
}: {
  currentStep: number,
  onChangeStep: (newStep: number) => void,
  onSaveStep: (newStep: number) => void,
  isReadyToNext?: boolean,
}) => (
  <div styleName="footerContainer">
    {/* <div styleName="backContainer"> */}

    <Container correct>
      <Row>
        <Col
          size={12}
          md={2}
          mdVisible={currentStep !== 1}
          hidden={currentStep === 1}
        >
          <div styleName="leftButtonContainer">
            <div
              styleName="leftButton"
              onClick={() => onChangeStep(currentStep - 1)}
              onKeyDown={() => {}}
              role="button"
              tabIndex="0"
            >
              <Icon type="arrowLeft" />
              <span>Go back</span>
            </div>
          </div>
        </Col>
        <Col size={12} md={currentStep !== 1 ? 6 : 8}>
          <div styleName="footerTextContainer">
            <span styleName="footerText">
              This listing isn’t active yet. It will be available to shoppers
              once you open your shop.
            </span>
          </div>
        </Col>
        <Col size={12} md={4}>
          <div styleName="nextButtonContainer">
            <Button
              onClick={() => {
                onSaveStep(currentStep + 1);
              }}
              dataTest="wizardBackButton"
              big
              disabled={!isReadyToNext}
            >
              {(currentStep === 3 && <span>Publish my store</span>) || (
                <span>Next step</span>
              )}
            </Button>
          </div>
        </Col>
        {/* <Col md={12} mdHidden hidden={currentStep === 1}> */}
        <Col md={12} mdHidden hidden={currentStep === 1}>
          <div
            styleName="leftButton"
            onClick={() => onChangeStep(currentStep - 1)}
            onKeyDown={() => {}}
            role="button"
            tabIndex="0"
          >
            <Icon type="arrowLeft" />
            <span>Go back</span>
          </div>
        </Col>
      </Row>
    </Container>

    {/* </div> */}
  </div>
);

WizardFooter.defaultProps = {
  isReadyToNext: true,
};

export default WizardFooter;
