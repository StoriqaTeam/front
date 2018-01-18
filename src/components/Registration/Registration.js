// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';

type StateType = {
  login: string,
  password: string,
  passwordConfirmation: string,
};
type PropsType = {
  // viewer: ?PropTypes.object,
  data: ?Array<Object>,
  errors?: Array<Object>,
  relay: PropTypes.object,
};

class Registration extends Component<PropsType, StateType> {
  state: StateType = {
    login: '',
    password: '',
    passwordConfirmation: '',
  };

  handleRegistrationClick = () => {
    const { data, relay } = this.props;
    console.log({ data, relay });
  };

  render() {
    const { data, errors } = this.props;
    console.log({ data, errors });
    if (errors) {
      return (
        <div className="test">{errors}</div>
      );
    }
    return (
      <form>
        <label htmlFor="login">
          Login
          <input
            type="text"
            value={this.state.login}
            id="login"
          />
        </label>
        <br />
        <label htmlFor="password">
          Password
          <input
            id="password"
            type="password"
            value={this.state.password}
          />
        </label>
        <br />
        <label htmlFor="passwordConfirmation">
          Password confirmation
          <input
            id="passwordConfirmation"
            type="password"
            value={this.state.passwordConfirmation}
          />
        </label>
        <br />
        <button type="button">Register</button>
      </form>
    );
  }
}

export default Registration;
