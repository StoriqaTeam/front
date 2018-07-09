// @flow

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { createRefetchContainer, graphql } from 'react-relay';
import type { Environment } from 'relay-runtime';
import { pick, filter, propEq, concat, complement } from 'ramda';

import { AlertsContainer } from 'components/Alerts';
import { AlertContextProvider } from 'components/App/AlertContext';
import { currentUserShape } from 'utils/shapes';

import type { AlertPropsType } from 'components/Alerts';
import type { AddAlertInputType } from 'components/App/AlertContext';

import { AppContext } from './index';

import './App.scss';

type StateType = {
  alerts: Array<AlertPropsType>,
};

type PropsType = {
  me: ?{},
  mainPage: ?{},
  cart: ?{},
  languages: ?Array<{ id: number, name: string }>,
  currencies: ?Array<{ id: number, name: string }>,
  categories: any,
  children: any,
  relay: {
    environment: Environment,
    refetch: Function,
  },
};

class App extends Component<PropsType, StateType> {
  state: StateType = {
    alerts: [],
  };

  getChildContext() {
    const { languages, currencies, categories, relay, me = {} } = this.props;
    return {
      environment: relay.environment,
      handleLogin: this.handleLogin,
      currentUser: pick(['id', 'rawId'], me || {}),
      directories: {
        languages,
        currencies,
        categories,
      },
    };
  }

  handleLogin = () => {
    this.props.relay.refetch({}, null, () => {}, { force: true });
  };

  handleAlertClose = (timestamp: number) => {
    this.setState(prevState => ({
      alerts: filter(
        complement(propEq('createdAtTimestamp', timestamp)),
        prevState.alerts,
      ),
    }));
  };

  addAlert = (alert: AddAlertInputType) => {
    this.setState(prevState => ({
      alerts: concat(
        [
          {
            ...alert,
            onClose: this.handleAlertClose,
            createdAtTimestamp: Date.now() + Math.random() * 1000,
          },
        ],
        prevState.alerts,
      ),
    }));
  };

  render() {
    const { me, mainPage, cart, children, categories } = this.props;
    console.log('>>> App props: ', { props: this.props });
    return (
      <AppContext.Provider value={{ categories }}>
        <Fragment>
          <AlertsContainer alerts={this.state.alerts} />
          <AlertContextProvider
            value={{
              addAlert: this.addAlert,
            }}
          >
            {children && React.cloneElement(children, { me, mainPage, cart })}
          </AlertContextProvider>
        </Fragment>
      </AppContext.Provider>
    );
  }
}

App.childContextTypes = {
  environment: PropTypes.object.isRequired,
  handleLogin: PropTypes.func,
  showAlert: PropTypes.func,
  // TODO: create HOC that extract directories from context to props
  // withDirectories(directoriesNames: Array<string> = [])(Component)
  directories: PropTypes.object,
  currentUser: currentUserShape,
};

export default createRefetchContainer(
  App,
  graphql`
    fragment App_me on User {
      ...Profile_me
      id
      rawId
      email
      firstName
      lastName
      avatar
    }
  `,
  graphql`
    query App_me_Query {
      id
      me {
        ...App_me
      }
    }
  `,
);
