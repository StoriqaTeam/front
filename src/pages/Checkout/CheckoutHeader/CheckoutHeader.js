// @flow

import React from 'react';

import { Icon } from 'components/Icon';

import StepLabel from './StepLabel';

import './CheckoutHeader.scss';

type PropsType = {
  currentStep: number,
  isReadyToNext: boolean,
  onChangeStep: (step: number) => void,
};

const CheckoutHeader = ({
  currentStep,
  isReadyToNext,
  onChangeStep,
}: PropsType) => (
  <div styleName="stepperContainer">
    <StepLabel
      step={1}
      text="Delivery info"
      currentStep={currentStep}
      isReadyToNext={isReadyToNext}
      onChangeStep={onChangeStep}
    />
    <Icon type="arrowRight" />
    <StepLabel
      step={2}
      text="Submit"
      currentStep={currentStep}
      isReadyToNext={isReadyToNext}
      onChangeStep={onChangeStep}
    />
    <Icon type="arrowRight" />
    <StepLabel
      step={3}
      text="Payment info"
      currentStep={currentStep}
      isReadyToNext={isReadyToNext}
      onChangeStep={onChangeStep}
    />
  </div>
);

export default CheckoutHeader;
