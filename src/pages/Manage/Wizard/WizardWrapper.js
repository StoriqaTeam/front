// @flow

import React from 'react';
import { pathOr } from 'ramda';
import { withRouter, routerShape } from 'found';
// import { graphql, Relay } from 'react-relay';

import { Page } from 'components/App';

import WizardHeader from './WizardHeader';
import WizardFooter from './WizardFooter';

import './WizardWrapper.scss';

type PropsType = {
  router: routerShape,
};

type StateType = {};

class WizardWrapper extends React.Component<PropsType, StateType> {
  static getDerivedStateFromProps(nextProps) {
    const step = parseInt(
      pathOr('1', ['location', 'query', 'step'], nextProps),
      10,
    );
    return { step };
  }

  constructor(props: PropsType) {
    super(props);
    const step = parseInt(
      pathOr('1', ['location', 'query', 'step'], props),
      10,
    );
    this.state = {
      step,
    };
  }

  handleChangeStep = (step: number) => {
    this.props.router.push(`/manage/wizard?step=${step}`);
  };

  handleOnSave = () => {};

  render() {
    const { step } = this.state;

    return (
      <div styleName="wizardContainer">
        <div styleName="stepperWrapper">
          <WizardHeader currentStep={step} onChange={this.handleChangeStep} />
        </div>
        <div styleName="contentWrapper">
          <h1>content</h1>
        </div>
        <div styleName="footerWrapper">
          <WizardFooter
            step={step}
            onChange={this.handleChangeStep}
            onSave={this.handleOnSave}
          />
        </div>
      </div>
    );
  }
}

export default withRouter(Page(WizardWrapper));
