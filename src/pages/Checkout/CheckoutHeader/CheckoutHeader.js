// @flow strict

import React from 'react';

import { Icon } from 'components/Icon';

import StepLabel from './StepLabel';

import './CheckoutHeader.scss';

import t from './i18n';

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
      text={t.deliveryInfo}
      currentStep={currentStep}
      isReadyToNext={isReadyToNext}
      onChangeStep={onChangeStep}
    />
    <Icon type="arrowRight" />
    <StepLabel
      step={2}
      text={t.summary}
      currentStep={currentStep}
      isReadyToNext={isReadyToNext}
      onChangeStep={onChangeStep}
    />
    <Icon type="arrowRight" />
    <StepLabel
      step={3}
      text={t.paymentInfo}
      currentStep={currentStep}
      isReadyToNext={isReadyToNext}
      onChangeStep={onChangeStep}
    />
  </div>
);

export default CheckoutHeader;
