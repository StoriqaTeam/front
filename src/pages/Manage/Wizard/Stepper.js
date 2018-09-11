// @flow strict

import * as React from 'react';
import { withRouter, matcherShape, routerShape } from 'found';
import { createFragmentContainer, graphql } from 'react-relay';

import WizardHeader from './WizardHeader';

import { StoreNameStep, AddressStep, ProductsStep } from './Steps';

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
        {step === 3 && (
          <ProductsStep
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

export default createFragmentContainer(
  withRouter(Stepper),
  graphql`
    fragment Stepper_me on User {
      id
      wizardStore {
        id
        completed
        storeId
        store {
          id
          ...AddressStep_store
          ...ProductsStep_store
        }
      }
      ...StoreNameStep_me
    }
  `,
);
