// @flow strict

import React from 'react';

import { Icon } from 'components/Icon';
import { Button } from 'components/common/Button';
import { Container, Col, Row } from 'layout';

import './WizardFooter.scss';

import t from './i18n';

const WizardFooter = ({
  currentStep,
  onChangeStep,
  onSaveStep,
  isReadyToNext,
  isSavingInProgress,
}: {
  currentStep: number,
  onChangeStep: (newStep: number) => void,
  onSaveStep: (newStep: number) => void,
  isReadyToNext?: boolean,
  isSavingInProgress: boolean,
}) => (
  <div styleName="footerContainer">
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
              data-test={`wizardGoBackButton-${currentStep}`}
            >
              <Icon type="arrowLeft" />
              <span>{t.goBack}</span>
            </div>
          </div>
        </Col>
        <Col size={12} md={currentStep !== 1 ? 6 : 8}>
          <div styleName="footerTextContainer">
            <span styleName="footerText">{t.thisListingIsntActiveYet}</span>
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
              isLoading={currentStep !== 4 && isSavingInProgress}
            >
              {(currentStep === 4 && <span>{t.publishStore}</span>) || (
                <span>{t.nextStep}</span>
              )}
            </Button>
          </div>
        </Col>
        <Col md={12} mdHidden hidden={currentStep === 1}>
          <div
            styleName="leftButton"
            onClick={() => onChangeStep(currentStep - 1)}
            onKeyDown={() => {}}
            role="button"
            tabIndex="0"
            data-test={`wizardGoBackButton-${currentStep}`}
          >
            <Icon type="arrowLeft" />
            <span>{t.goBack}</span>
          </div>
        </Col>
      </Row>
    </Container>
  </div>
);

WizardFooter.defaultProps = {
  isReadyToNext: true,
};

export default WizardFooter;
