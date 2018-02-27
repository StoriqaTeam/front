// @flow

import React from 'react';
import { Link } from 'found';

import './Header.scss';

type PropTypes = {
  isSignUp: ?boolean,
  handleToggle: Function,
};

const Header = (props: PropTypes) => (
  <div
    styleName="container"
    onClick={props.handleToggle}
    onKeyDown={() => {}}
    role="button"
    tabIndex="0"
  >
    <strong styleName="title">
      { props.isSignUp ? 'Sign Up' : 'Sign In' }
    </strong>
    <div
      styleName="linkTitle"
      onKeyDown={() => {}}
      role="button"
      tabIndex="0"
    >
      { props.isSignUp ? 'Sign In' : 'Sign Up' }
    </div>
  </div>
);

export default Header;
