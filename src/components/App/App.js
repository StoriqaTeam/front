// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';
import { Link } from 'found';
import { pathOr } from 'ramda';
import type { Node } from 'react';
import type { Environment } from 'relay-runtime';

type PropsType = {
  viewer: ?{
    currentUser: {},
  },
  children: Node,
  relay: {
    environment: Environment,
  },
};

class App extends PureComponent<PropsType> {
  getChildContext() {
    return {
      environment: this.props.relay.environment,
    };
  }
  render() {
    const { children, viewer } = this.props;
    const currentUser = pathOr(null, ['currentUser'], viewer);
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">App here</h1>
          {currentUser && (<Link to="/logout">Logout</Link>)}
          {!currentUser && (<Link to="/login">Login</Link>)}
        </header>
        {children}
      </div>
    );
  }
}

App.childContextTypes = {
  environment: PropTypes.object.isRequired,
};

// fragment just need for working `createFragmentContainer`
// `createFragmentContainer` need for having `environment` in context
export default createFragmentContainer(
  App,
  graphql`
    fragment App_apiVersion on Query {
      apiVersion
    }
  `,
);
