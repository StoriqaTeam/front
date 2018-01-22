// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'found';
import { pathOr } from 'ramda';
import { withCookies } from 'react-cookie';

import { GetJWTByEmailMutation } from 'relay/mutations';

type PropsType = {
  cookies: Object,
  router: Object,
};

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
        console.log({ response, errors }); // eslint-disable-line
        const jwt = pathOr(null, ['getJWTByEmail', 'token'], response);
        if (jwt) {
          this.props.cookies.set('_jwt', { value: jwt });
          this.props.router.push('/');
        }
      },
      onError: (error: Error) => {
        console.log({ error }); // eslint-disable-line
      },
    });
  };

  facebookLoginString = () => {
    // $FlowIgnore
    const appId = `${process.env.REACT_APP_FACEBOOK_APP_ID}`;
    const redirectUri = 'http://localhost:3003/fb';
    const stateParam = '{someKey=asdfajslkjsdf}';
    return `https://www.facebook.com/v2.11/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&state=${stateParam}&scope=email,public_profile`;
  };

  render() {
    return (
      <div>
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
        </form>
        <br />
        <br />
        <a
          href={this.facebookLoginString()}
          target="_blank"
        >
          Facebook login
        </a>
        <br />
        <br />
        <Link to="/registration">Register</Link>
      </div>
    );
  }
}

Login.contextTypes = {
  environment: PropTypes.object.isRequired,
};

export default withRouter(withCookies(Login));
