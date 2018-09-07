// @flow strict

import * as React from 'react';
import { withRouter, matcherShape, routerShape } from 'found';

import WizardHeader from './WizardHeader';

import { StoreNameStep, AddressStep } from './Steps';

import './Stepper.scss';

type PropsType = {
  match: matcherShape,
  router: routerShape,
  me: ?{
    wizardStore: ?{
      store: ?{},
    },
  },
};

class Stepper extends React.PureComponent<PropsType> {
  render() {
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
            onChangeStep={() => {}}
          />
        </div>
        {step === 1 && <StoreNameStep me={this.props.me} />}
        {step === 2 && (
          <AddressStep
            store={
              this.props.me &&
              this.props.me.wizardStore &&
              this.props.me.wizardStore.store
            }
          />
        )}
      </React.Fragment>
    );
  }
}

export default withRouter(Stepper);
