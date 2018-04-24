// @flow

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { createRefetchContainer, graphql } from 'react-relay';
import type { Environment } from 'relay-runtime';
import { pick } from 'ramda';
import { withErrorBoundary } from 'react-error-boundary';

import { log } from 'utils';
import { Alert } from 'components/common/Alert';
import { currentUserShape } from 'utils/shapes';

import './App.scss';

type StateType = {
  isAlertShown: boolean,
  isError: boolean,
  alertText: string,
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
    isAlertShown: false,
    isError: false,
    alertText: '',
  };

  getChildContext() {
    const {
      languages,
      currencies,
      categories,
      relay,
      me = {},
    } = this.props;
    return {
      environment: relay.environment,
      handleLogin: this.handleLogin,
      showAlert: this.showAlert,
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

  showAlert = (text: string, isError: boolean = false) => {
    this.setState({
      isAlertShown: true,
      isError,
      alertText: text,
    });
  };

  render() {
    const { me, mainPage, children } = this.props;
    const { isAlertShown, alertText, isError } = this.state;
    return (
      <Fragment>
        <Alert
          showAlert={isAlertShown}
          text={alertText}
          isError={isError}
        />
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

const AppWithErrorBoundary = withErrorBoundary(
  App,
  () => (<div>Oooops :-/</div>),
  (error: Error, componentStack: string) => {
    log.debug({ error, componentStack });
  },
);

export default createRefetchContainer(
  AppWithErrorBoundary,
  graphql`
    fragment App_me on User {
      ...Profile_me
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
