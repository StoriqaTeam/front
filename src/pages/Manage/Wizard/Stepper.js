// @flow strict

import * as React from 'react';
import { withRouter, matcherShape, routerShape } from 'found';

import WizardHeader from './WizardHeader';
import WizardFooter from './WizardFooter';
import { StoreNameStep } from './Steps';

import './Stepper.scss';

type PropsType = {
  match: matcherShape,
  router: routerShape,
  me: ?{},
};

class Stepper extends React.PureComponent<PropsType> {
  render() {
    console.log({ props: this.props });
    const {
      match: {
        location: {
          query: { step: stepStr },
        },
      },
    } = this.props;
    const step = parseInt(stepStr, 10);

    if (!step || step < 1 || step > 3) {
      if (process.env.BROWSER) {
        this.props.router.push('/manage/wizard?step=1');
      }
    }

    return (
      <React.Fragment>
        <div styleName="stepperWrapper">
          <WizardHeader
            currentStep={step}
            isReadyToNext={false}
            onChangeStep={console.log}
          />
        </div>
        <div styleName="contentWrapper">
          {step === 1 && <StoreNameStep me={this.props.me} />}
        </div>
        <div styleName="footerWrapper">
          <WizardFooter step={step} onClick={() => {}} />
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(Stepper);
