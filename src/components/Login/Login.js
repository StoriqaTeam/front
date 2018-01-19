// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'found';

import { GetJWTByEmailMutation } from 'relay/mutations';

type PropsType = {};

type StateType = {
  login: string,
  password: string,
};

class Login extends Component<PropsType, StateType> {
  state: StateType = {
    login: '',
    password: '',
  };

  handleInputChange = (e: Object) => {
    const { target } = e;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;

    this.setState({
      [name]: value,
    });
  };

  handleSubmitClick = () => {
    const { login, password } = this.state;
    GetJWTByEmailMutation.commit({
      login,
      password,
      environment: this.context.environment,
      onCompleted: (response: ?Object, errors: ?Array<Error>) => {
        console.log({ response, errors });
      },
      onError: (error: Error) => {
        console.log({ error });
      },
    });
  };

  render() {
    return (
      <form>
        <label htmlFor="login">
          Login
          <br />
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
          <br />
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
          onClick={this.handleSubmitClick}
        >
          Login
        </button>
        <br />
        <Link to="/registration">Register</Link>
      </form>
    );
  }
}

Login.contextTypes = {
  environment: PropTypes.object.isRequired,
};

export default Login;
