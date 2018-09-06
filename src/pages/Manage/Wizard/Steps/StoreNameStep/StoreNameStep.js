// @flow strict

import * as React from 'react';
import { createRefetchContainer, graphql, Environment } from 'react-relay';

import { Spinner } from 'components/common/Spinner';
import { Button } from 'components/common/Button';
import { log } from 'utils';

import { createWizardMutation } from './mutations/StoreNameStepCreateWizardMutation';
import WithStore from './WithStore';
import WithoutStore from './WithoutStore';

import type { StoreNameStep_me as StoreNameStepMe } from './__generated__/StoreNameStep_me.graphql';

import './StoreNameStep.scss';

type PropsType = {
  me: ?StoreNameStepMe,
  relay: {
    environment: Environment,
    refetch: (...args: Array<mixed>) => void,
  },
};

type StateType = {
  isInProcess: boolean,
  isError: boolean,
};

class StoreNameStep extends React.Component<PropsType, StateType> {
  state: StateType = {
    isInProcess: false,
    isError: false,
  };

  componentDidMount() {
    this.mounted = true;

    this.createWizard();
  }

  componentWillUnmout() {
    this.mounted = false;
  }

  mounted: boolean = false;

  createWizard = (): void => {
    if (this.props.me && !this.props.me.wizardStore) {
      this.setState({ isInProcess: true, isError: false });
      createWizardMutation({
        environment: this.props.relay.environment,
        variables: {},
      })
        .then(() => {
          if (!this.mounted) return;

          log.debug('fetched');
          this.props.relay.refetch(
            {},
            null,
            (error: ?Error) => {
              if (error) {
                log.error('Wizard creation error', error);
                this.setState(prevState => ({
                  ...prevState,
                  isError: true,
                }));
              }
            },
            { force: true },
          );
        })
        .catch(err => {
          if (!this.mounted) return;

          log.error('Wizard creation error', err);
          this.setState(prevState => ({
            ...prevState,
            isError: true,
          }));
        })
        .finally(() => {
          log.debug('finally', { mounted: this.mounted });
          if (!this.mounted) return;

          this.setState(prevState => ({
            ...prevState,
            isInProcess: false,
          }));
        });
    }
  };

  renderLoader = (): React.Node => (
    <div>
      <div styleName="container">
        <span styleName="text">
          Initializing wizard...<br />Please wait.
        </span>
        <span styleName="description">- Storiqa team</span>
        <Spinner />
      </div>
    </div>
  );

  renderError = (): React.Node => (
    <div styleName="error">
      <p>Error while initialize wizard</p>
      <br />
      <Button
        big
        onClick={() => {
          this.createWizard();
        }}
      >
        Try again
      </Button>
    </div>
  );

  render() {
    const { isInProcess, isError } = this.state;
    if (isInProcess) {
      return this.renderLoader();
    } else if (isError) {
      return this.renderError();
    }

    const wizardStore = this.props.me && this.props.me.wizardStore;
    if (!wizardStore) {
      return this.renderLoader();
    }

    const storeId = wizardStore.store && wizardStore.store.id;

    return storeId ? (
      <WithStore me={this.props.me} />
    ) : (
      <WithoutStore me={this.props.me} />
    );
  }
}

export default createRefetchContainer(
  StoreNameStep,
  graphql`
    fragment StoreNameStep_me on User {
      ...WithoutStore_me
      ...WithStore_me
      wizardStore {
        id
        store {
          id
        }
      }
    }
  `,
  graphql`
    query StoreNameStep_Refetch_Query {
      me {
        ...StoreNameStep_me
      }
    }
  `,
);
