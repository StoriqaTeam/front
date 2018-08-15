// @flow

import React from 'react';
import { Link } from 'found';

import './AuthorizationHeader.scss';

type PropTypes = {
  isSignUp: ?boolean,
  alone: ?boolean,
  handleToggle: Function,
};

const AuthorizationHeader = (props: PropTypes) => {
  const { isSignUp, alone, handleToggle } = props;
  const linkText = isSignUp ? 'Sign In' : 'Sign Up';
  return (
    <div styleName="container">
      <strong styleName="title">{isSignUp ? 'Sign Up' : 'Sign In'}</strong>
      {alone ? (
        <Link
          styleName="linkTitle"
          onClick={handleToggle}
          to={isSignUp ? '/login' : '/registration'}
          data-test={isSignUp ? 'loginLink' : 'registrationLink'}
        >
          {linkText}
        </Link>
      ) : (
        <div
          styleName="linkTitle"
          onClick={handleToggle}
          onKeyDown={() => {}}
          role="button"
          tabIndex="0"
          data-test={
            isSignUp ? 'loginToggleButton' : 'registrationToggleButton'
          }
        >
          {linkText}
        </div>
      )}
    </div>
  );
};

export default AuthorizationHeader;
