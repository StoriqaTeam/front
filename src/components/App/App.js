// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createRefetchContainer, graphql } from 'react-relay';
import type { Environment } from 'relay-runtime';

import { GoogleAPIWrapper, AddressForm } from 'components/AddressAutocomplete';
import Header from './Header';
import './App.scss';


type PropsType = {
  me: ?{},
  children: any,
  relay: {
    environment: Environment,
    refetch: Function,
  },
};

type SelectType = {
  id: string,
  label: string,
}

type AddressType = {
  country: string,
  region: ?string,
  city: string,
}

type StateType = {
  country: ?SelectType,
  address: ?AddressType,
}

class App extends Component<PropsType, StateType> {
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
      <div>
        <Header user={me} />
        {children && React.cloneElement(children, { me })}
        <br />
        <div style={{ width: '400px' }}>
          <GoogleAPIWrapper>
            <AddressForm />
          </GoogleAPIWrapper>
        </div>
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
      ...Profile_me
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
