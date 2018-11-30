// @flow

import React from 'react';

import { AppContext, Page } from 'components/App';
import { Authorization } from 'components/Authorization';

import './Login.scss';

const Login = () => (
  <AppContext.Consumer>
    {({ environment, handleLogin }) => (
      <div styleName="container">
        <div styleName="wrapper">
          <Authorization
            isLogin
            environment={environment}
            handleLogin={handleLogin}
          />
        </div>
      </div>
    )}
  </AppContext.Consumer>
);

export default Page(Login, { withoutCategories: true });
