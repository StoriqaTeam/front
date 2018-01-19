// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { CreateUserMutation } from 'relay/mutations';

type StateType = {
  login: string,
  password: string,
};

type PropsType = {};

class Registration extends Component<PropsType, StateType> {
  state: StateType = {
    login: '',
    password: '',
  };

  handleRegistrationClick = () => {
    const { login, password } = this.state;
    CreateUserMutation.commit({
      login,
      password,
      environment: this.context.environment,
      onCompleted: (response: ?Object, errors: ?Array<Error>) => console.log({ response, errors }),
      onError: (error: Error) => console.log({ error }),
    });
  };

  handleInputChange = (e: Object) => {
    const { target } = e;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;

    this.setState({
      [name]: value,
    });
  };

  render() {
    return (
      <form>
        <label htmlFor="login">
          Login
          <input
            name="login"
            type="text"
            value={this.state.login}
            onChange={this.handleInputChange}
          />
        </label>
        <br />
        <label htmlFor="password">
          Password
          <input
            name="password"
            type="password"
            value={this.state.password}
            onChange={this.handleInputChange}
          />
        </label>
        <br />
        <button
          type="button"
          onClick={this.handleRegistrationClick}
        >
          Register
        </button>
      </form>
    );
  }
}

Registration.contextTypes = {
  environment: PropTypes.object.isRequired,
};

export default Registration;
