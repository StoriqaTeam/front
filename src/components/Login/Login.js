// @flow

import React, { Component } from 'react';

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

  handleLoginChange = (e: any) => this.setState({ login: e.target.value });

  handlePasswordChange = (e: any) => this.setState({ password: e.target.value });

  handleSubmitClick = () => {
    const { login, password } = this.state;
    if (login && login.length > 0 && password && password.length > 0) {
      //
    }
  };

  render() {
    return (
      <form>
        <label htmlFor="login">
          Login
          <br />
          <input
            id="login"
            type="text"
            value={this.state.login}
            onChange={this.handleLoginChange}
          />
        </label>
        <br />
        <label htmlFor="password">
          Password
          <br />
          <input
            id="password"
            type="password"
            value={this.state.password}
            onChange={this.handlePasswordChange}
          />
        </label>
        <br />
        <button
          type="button"
          onClick={this.handleSubmitClick}
        >
          Login
        </button>
      </form>
    );
  }
}

export default Login;
