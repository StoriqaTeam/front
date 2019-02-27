// @flow strict

import React from 'react';
import classNames from 'classnames';
import { contains } from 'ramda';

import { Icon } from 'components/Icon';

import './WizardHeader.scss';

import t from './i18n';

const WizardStepper = ({
  currentStep,
  onChangeStep,
  onSaveStep,
  allowedSteps,
}: {
  currentStep: number,
  onChangeStep: (val: number) => void,
  onSaveStep: (newStep: number) => void,
  allowedSteps: Array<number>,
}) => {
  const StepLabel = ({ step, text }: { step: number, text: string }) => (
    <div
      styleName={classNames('item', { active: currentStep === step })}
      onClick={() => {
        if (contains(step, allowedSteps)) {
          if (step - currentStep === 1) {
            onSaveStep(step);
          } else {
            onChangeStep(step);
          }
        }
        if (step < currentStep) {
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
      <StepLabel step={2} text={t.setUpStore} />
      <Icon type="arrowRight" />
      <StepLabel step={3} text={t.fillYourStoreWithGoods} />
      <Icon type="arrowRight" />
      <StepLabel step={4} text={t.addYourCard} />
    </div>
  );
};

export default WizardStepper;
