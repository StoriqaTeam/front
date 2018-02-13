// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { createRefetchContainer, graphql } from 'react-relay';
import { Link } from 'found';
import type { Environment } from 'relay-runtime';

import './App.scss';

type PropsType = {
  me: ?{},
  children: any,
  relay: {
    environment: Environment,
    refetch: Function,
  },
};

class App extends PureComponent<PropsType> {
  getChildContext() {
    return {
      environment: this.props.relay.environment,
      handleLogin: this.handleLogin,
    };
  }

  handleLogin = () => {
    this.props.relay.refetch({}, null, () => {}, { force: true });
  };

  render() {
    const { me, children } = this.props;
    return (
      <div styleName="root">
        <header styleName="header">
          <h1 styleName="title">App here</h1>
          {me && (<Link to="/logout">Logout</Link>)}
          {!me && (<Link to="/login">Login</Link>)}
        </header>
        {children && React.cloneElement(children, { me })}
      </div>
    );
  }
}

App.childContextTypes = {
  environment: PropTypes.object.isRequired,
  handleLogin: PropTypes.func,
};

export default createRefetchContainer(
  App,
  graphql`
    fragment App_me on User {
      id
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
