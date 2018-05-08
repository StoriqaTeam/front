// @flow

import React from 'react';
import classNames from 'classnames';

import { Icon } from 'components/Icon';
import { Button } from 'components/common/Button';

import './WizardFooter.scss';

const WizardFooter = ({ step }: { step: number }) => (
  <div styleName="footerContainer">
    <div styleName="backContainer">
      <Button
        href="/manage/wizard"
        dataTest="wizardBackButton"
      >
        Back
      </Button>
    </div>
    <div styleName="nextContainer">
      <Button
        href="/manage/wizard"
        dataTest="wizardBackButton"
      >
        next step
      </Button>
    </div>
  </div>
);

export default WizardFooter;