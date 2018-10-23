// @flow strict

import React from 'react';
import classNames from 'classnames';

import { Icon } from 'components/Icon';

import './WizardHeader.scss';

import t from './i18n';

const WizardStepper = ({
  currentStep,
  onChangeStep,
  isReadyToNext,
}: {
  currentStep: number,
  onChangeStep: (val: number) => void,
  isReadyToNext: boolean,
}) => {
  const StepLabel = ({ step, text }: { step: number, text: string }) => (
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

  return (
    <div styleName="stepperContainer">
      <StepLabel step={1} text={t.nameYourStore} />
      <Icon type="arrowRight" />
      <StepLabel step={2} text={t.setUpStore}/>
      <Icon type="arrowRight" />
      <StepLabel step={3} text={t.fillYourStoreWithGoods}/>
    </div>
  );
};

export default WizardStepper;
