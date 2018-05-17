// @flow

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { createRefetchContainer, graphql } from 'react-relay';
import type { Environment } from 'relay-runtime';
import { pick } from 'ramda';

import { AlertsContainer } from 'components/Alerts';
import { AlertContextProvider } from 'components/App/AlertContext';
import { currentUserShape } from 'utils/shapes';

import type { AlertPropsType } from 'components/Alerts';

import './App.scss';

type StateType = {
  alerts: Array<AlertPropsType>,
};

type PropsType = {
  me: ?{},
  mainPage: ?{},
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

  alertsDiv: any;

  handleLogin = () => {
    this.props.relay.refetch({}, null, () => {}, { force: true });
  };

  generateAlerts = () => {
    const result = [];
    for (let i = 0; i < 4; i++) {
      result.push({
        type: 'default',
        text:
          'Module build failed: SyntaxError: Unexpected token, expected , (65:28)',
        link: { text: 'ok' },
        onClose: () => {},
      });
    }
    return result;
  };

  render() {
    const { me, mainPage, children } = this.props;
    return (
      <Fragment>
        <AlertsContainer alerts={this.generateAlerts()} />
        {children && React.cloneElement(children, { me, mainPage })}
      </Fragment>
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
      ...Cart_me
      id
      rawId
      email
      firstName
      lastName
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
