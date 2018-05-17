// @flow

import React from 'react';
import classNames from 'classnames';

import { Icon } from 'components/Icon';
import { Button } from 'components/common/Button';

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
    <div styleName="backContainer">
      {currentStep !== 1 && (
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
      )}
      <span styleName="footerText">
        This listing isn’t active yet. It will be available to shoppers once you
        open your shop.
      </span>
    </div>
    <Button
      onClick={() => {
        onSaveStep(currentStep + 1);
      }}
      dataTest="wizardBackButton"
      big
      disabled={!isReadyToNext}
    >
      <span>Next step</span>
    </Button>
  </div>
);

WizardFooter.defaultProps = {
  isReadyToNext: true,
}

export default WizardFooter;
