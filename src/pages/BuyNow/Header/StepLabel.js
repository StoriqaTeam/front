// @flow strict

import React from 'react';
import classNames from 'classnames';

import './StepLabel.scss';

type PropsType = {
  step: number,
  text: string,
  currentStep: number,
  isReadyToNext: boolean,
  onChangeStep: (step: number) => void,
};

const StepLabel = ({
  step,
  text,
  currentStep,
  isReadyToNext,
  onChangeStep,
}: PropsType) => (
  <div
    styleName={classNames('item', { active: currentStep === step })}
    onClick={() => {
      if (isReadyToNext || step < currentStep) {
        onChangeStep(step);
      }
    }}
    onKeyDown={() => {}}
    role="button"
    tabIndex="0"
  >
    <span>{text}</span>
  </div>
);

export default StepLabel;
