// @flow

import React from 'react';
// import { Link } from 'found';

import { Button } from 'components/Button';
import { Icon } from 'components/Icon';

import { socialStrings } from 'utils';

import './UserDropdown.scss';

const LoginMenu = (props: { onClick: Function }) => (
  <div styleName="menu">
    <div
      styleName="link"
      onClick={() => { props.onClick(false); }}
      onKeyDown={() => {}}
      role="button"
      tabIndex="0"
    >
      Sign In
    </div>
    <div
      styleName="link"
      onClick={() => { props.onClick(true); }}
      onKeyDown={() => {}}
      role="button"
      tabIndex="0"
    >
      Sign Up
    </div>
    <div styleName="button">
      <Button
        iconic
        href={socialStrings.facebookLoginString()}
      >
        <Icon type="facebook" />
        <span>Sign In with Facebook</span>
      </Button>
    </div>
    <div styleName="button">
      <Button
        iconic
        href={socialStrings.googleLoginString()}
      >
        <Icon type="google" />
        <span>Sign In with Google</span>
      </Button>
    </div>
  </div>
);

export default LoginMenu;
