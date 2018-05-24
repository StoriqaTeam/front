// @flow

import React from 'react';
import classNames from 'classnames';

import { Icon } from 'components/Icon';

import './WizardHeader.scss';

const WizardStepper = ({
  currentStep,
  onChangeStep,
}: {
  currentStep: number,
  onChangeStep: (val: number) => void,
}) => {
  const StepLabel = ({ step, text }: { step: number, text: string }) => (
    <div
      styleName={classNames('item', { active: currentStep === step })}
      onClick={() => onChangeStep(step)}
      onKeyDown={() => {}}
      role="button"
      tabIndex="0"
    >
      <span>{text}</span>
    </div>
  );

  return (
    <div styleName="stepperContainer">
      <StepLabel step={1} text="name your store" />
      <Icon type="arrowRight" />
      <StepLabel step={2} text="set up store" />
      <Icon type="arrowRight" />
      <StepLabel step={3} text="fill your store with goods" />
    </div>
  );
};

export default WizardStepper;
