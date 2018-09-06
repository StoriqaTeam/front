// @flow

import React from 'react';

import { Icon } from 'components/Icon';
import { Button } from 'components/common/Button';
import { Container, Col, Row } from 'layout';

import './WizardFooter.scss';

type PropsType = {
  step: number,
  disabled?: boolean,
  loading?: boolean,
  onClick: () => void,
};

const WizardFooter = (props: PropsType) => (
  <div styleName="footerContainer">
    <Container correct>
      <Row>
        <Col
          size={12}
          md={2}
          mdVisible={props.step !== 1}
          hidden={props.step === 1}
        >
          <div styleName="leftButtonContainer">
            <div
              styleName="leftButton"
              onClick={() => {}}
              onKeyDown={() => {}}
              role="button"
              tabIndex="0"
            >
              <Icon type="arrowLeft" />
              <span>Go back</span>
            </div>
          </div>
        </Col>
        <Col size={12} md={props.step !== 1 ? 6 : 8}>
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
              onClick={props.onClick}
              dataTest="wizardBackButton"
              big
              disabled={props.disabled}
              isLoading={props.loading}
            >
              {(props.step === 3 && <span>Publish my store</span>) || (
                <span>Next step</span>
              )}
            </Button>
          </div>
        </Col>
        <Col md={12} mdHidden hidden={props.step === 1}>
          <div
            styleName="leftButton"
            onClick={() => {}}
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
  </div>
);

WizardFooter.defaultProps = {
  disabled: false,
  loading: false,
};

export default WizardFooter;
