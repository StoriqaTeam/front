// @flow

import React from 'react';
import classNames from 'classnames';

import { Icon } from 'components/Icon';
import { Button } from 'components/common/Button';

import './WizardFooter.scss';

const WizardFooter = ({
  step,
  onChange,
  onSave,
}: {
  step: number,
  onChange: (step: number) => void,
  onSave: () => void,
}) => (
  <div styleName="footerContainer">
    <div styleName="backContainer">
      {step !== 1 && (
        <div
          styleName="leftButton"
          onClick={() => onChange(step - 1)}
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
        if (step === 3) {
          onSave();
        } else {
          onChange(step + 1);
        }
      }}
      dataTest="wizardBackButton"
      big
    >
      <span>Next step</span>
    </Button>
  </div>
);

export default WizardFooter;
