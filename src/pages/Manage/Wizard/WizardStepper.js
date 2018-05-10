// @flow

import React from 'react';
import classNames from 'classnames';

import { Icon } from 'components/Icon';

import './WizardStepper.scss';

const WizardStepper = ({ step }: { step: number }) => (
  <div styleName="stepperContainer">
    <div styleName={classNames('item', { active: step === 1 })}>
      <span>name your store</span>
    </div>
    <Icon type="arrowRight" />
    <div styleName={classNames('item', { active: step === 2 })}>
      <span>set up store</span>
    </div>
    <Icon type="arrowRight" />
    <div styleName={classNames('item', { active: step === 3 })}>
      <span>fill your store with goods</span>
    </div>
  </div>
);

export default WizardStepper;
