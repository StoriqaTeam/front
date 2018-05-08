// @flow

import React from 'react';
// import { graphql, Relay } from 'react-relay';

import { Page } from 'components/App';

import WizardStepper from './WizardStepper';
import WizardFooter from './WizardFooter';

import './WizardWrapper.scss';

type PropsType = {
}

type StateType = {
}

class WizardWrapper extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <div styleName="wizardContainer">
        <div styleName="stepperWrapper">
          <WizardStepper step={2} />
        </div>
        <div styleName="contentWrapper">
          <h1>content</h1>
        </div>
        <div styleName="footerWrapper">
          <WizardFooter step={2} />
        </div>
      </div>
    );
  }
}

export default Page(WizardWrapper);