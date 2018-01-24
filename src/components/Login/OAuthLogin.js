// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { pathOr } from 'ramda';
import Cookies from 'universal-cookie';

import { GetJWTByProviderMutation } from 'relay/mutations';

type PropsType = {
  location: Object,
  provider: string,
};

type StateType = {
  isFetching: boolean,
  message: any,
};

class OAuthLogin extends Component<PropsType, StateType> {
  state = {
    isFetching: false,
    message: '',
  };

  componentDidMount() {
    const { location: { query: { code } } } = this.props;
    if (code) {
      GetJWTByProviderMutation.commit({
        provider: this.props.provider,
        token: code,
        environment: this.context.environment,
        onCompleted: (response: ?Object) => {
          const jwt = pathOr(null, ['getJWTByProvider', 'token'], response);
          if (jwt) {
            const cookies = new Cookies();
            cookies.set('__jwt', { value: jwt }, { path: '/' });
            window.location.href = '/'; // TODO: use refetch or store update
          }
        },
        onError: (error: Error) => {
          console.error(error); // eslint-disable-line
          this.setState({ isFetching: false, message: error });
        },
      });
    }
  }

  render() {
    const { isFetching, message } = this.state;
    if (isFetching) {
      return (
        <div>Please wait...</div>
      );
    }
    return (
      <div>{JSON.stringify(message)}</div>
    );
  }
}

OAuthLogin.contextTypes = {
  environment: PropTypes.object.isRequired,
};

export default OAuthLogin;
