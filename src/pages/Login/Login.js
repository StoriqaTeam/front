// @flow

import React from 'react';

import { AppContext, Page } from 'components/App';
import { Authorization } from 'components/Authorization';

import './Login.scss';

const Login = (props: { noPopup?: boolean }) => (
  <AppContext.Consumer>
    {({ environment, handleLogin }) => (
      <div styleName="container">
        <div styleName="wrapper">
          <Authorization
            isLogin
            environment={environment}
            handleLogin={handleLogin}
            noPopup={props.noPopup}
          />
        </div>
      </div>
    )}
  </AppContext.Consumer>
);

Login.defaultProps = {
  noPopup: undefined,
};

export default Page(Login, { withoutCategories: true });
