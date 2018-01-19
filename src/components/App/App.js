// @flow

import React, { PureComponent } from 'react';
import type { Node } from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';

type PropsType = {
  apiVersion: string,
  children: Node,
  relay: Object,
};

class App extends PureComponent<PropsType> {
  getChildContext() {
    return {
      environment: this.props.relay.environment,
    };
  }
  render() {
    const { children } = this.props;
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">{`App here (${this.props.apiVersion || ''})`}</h1>
        </header>
        {children}
      </div>
    );
  }
}

App.childContextTypes = {
  environment: PropTypes.object.isRequired,
};

export default createFragmentContainer(
  App,
  graphql`
    fragment App_apiVersion on Query {
      apiVersion
    }
  `,
);
