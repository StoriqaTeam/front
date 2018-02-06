// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { createRefetchContainer, graphql } from 'react-relay';
import { Link } from 'found';
import type { Node } from 'react';
import type { Environment } from 'relay-runtime';

import { log } from 'utils';

import './App.scss';

type PropsType = {
  viewer: ?any,
  children: Node,
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

  componentDidMount() {
    log.debug('App.componentDidMount', { props: this.props });
  }

  componentWillReceiveProps(nextProps) {
    log.debug('App componentWillReceiveProps', { nextProps });
  }

  handleLogin = () => {
    log.debug('App handleLogin');
    this.props.relay.refetch({ itemID: 0 }, null, () => {}, { force: true });
  };

  render() {
    const { viewer } = this.props;
    return (
      <div styleName="root">
        <header styleName="header">
          <h1 styleName="title">
            <Link to="/">App</Link>
          </h1>
          <br />
          <Link to="/logout">Logout</Link>
          <br />
          <Link to="/login">Login</Link>
          <br />
          <Link to="/profile">Profile</Link>
          <br />
        </header>
        {this.props.children && React.cloneElement(this.props.children, { viewer })}
      </div>
    );
  }
}

App.childContextTypes = {
  environment: PropTypes.object.isRequired,
  handleLogin: PropTypes.func,
};

// fragment just need for working `createFragmentContainer`
// `createFragmentContainer` need for having `environment` in context
export default createRefetchContainer(
  App,
  graphql`
    fragment App_viewer on Viewer {
      currentUser {
        id
        email
      }
      ...Profile_viewer
    }
  `,
  graphql`
    query App_viewer_Query($itemID:ID!) {
      viewer: node(id: $itemID) {
        ... on Viewer {
          ...App_viewer
        }
      }
    }
  `,
);
