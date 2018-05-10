// @flow

import React from 'react';
import classNames from 'classnames';

import { Icon } from 'components/Icon';
import { Button } from 'components/common/Button';

import './WizardFooter.scss';

const WizardFooter = ({ step }: { step: number }) => (
  <div styleName="footerContainer">
    <div styleName="backContainer">
      {step !== 1 && (
        <div
          styleName="leftButton"
          onClick={console.log}
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
    <Button dataTest="wizardBackButton" big>
      <span>Next step</span>
    </Button>
  </div>
);

export default WizardFooter;
