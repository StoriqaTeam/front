// @flow

import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { createRefetchContainer, graphql } from 'react-relay';
import type { Environment } from 'relay-runtime';
import { pick } from 'ramda';
import { withRouter } from 'found';

import { currentUserShape } from 'utils/shapes';

import './App.scss';

type PropsType = {
  me: ?{},
  languages: ?Array<{ id: number, name: string }>,
  currencies: ?Array<{ id: number, name: string }>,
  children: any,
  router: any,
  relay: {
    environment: Environment,
    refetch: Function,
  },
};

class App extends PureComponent<PropsType> {
  getChildContext() {
    const {
      languages,
      currencies,
      relay,
      me = {},
    } = this.props;
    return {
      environment: relay.environment,
      handleLogin: this.handleLogin,
      currentUser: pick(['id', 'rawId'], me || {}),
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
        <span style={{ cursor: 'pointer' }} onClick={() => this.props.router.push('/manage/store/new')}>new store</span>
        {children && React.cloneElement(children, { me })}
      </Fragment>
    );
  }
}

App.childContextTypes = {
  environment: PropTypes.object.isRequired,
  handleLogin: PropTypes.func,
  // TODO: create HOC that extract directories from context to props
  // withDirectories(directoriesNames: Array<string> = [])(Component)
  directories: PropTypes.object,
  currentUser: currentUserShape,
};


const AppComponent = createRefetchContainer(
  App,
  graphql`
    fragment App_me on User
    {
      id
      rawId
      ...Profile_me
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

export default withRouter(AppComponent);
