// @flow

import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { createRefetchContainer, graphql } from 'react-relay';
import type { Environment } from 'relay-runtime';

import { log } from 'utils';

import './App.scss';

type PropsType = {
  me: ?{},
  languages: ?Array<{ id: number, name: string }>,
  currencies: ?Array<{ id: number, name: string }>,
  children: any,
  relay: {
    environment: Environment,
    refetch: Function,
  },
};

class App extends PureComponent<PropsType> {
  getChildContext() {
    const { languages, currencies, relay } = this.props;
    return {
      environment: relay.environment,
      handleLogin: this.handleLogin,
      directories: {
        languages,
        currencies,
      },
    };
  }

  handleLogin = () => {
    this.props.relay.refetch({}, null, () => {}, { force: true });
  };

  render() {
    const { me, children } = this.props;
    return (
      <Fragment>
        {children && React.cloneElement(children, { me })}
      </Fragment>
    );
  }
}

App.childContextTypes = {
  environment: PropTypes.object.isRequired,
  handleLogin: PropTypes.func,
  directories: PropTypes.object,
};

export default createRefetchContainer(
  App,
  graphql`
    fragment App_me on User {
      ...Profile_me
      id
      rawId
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
