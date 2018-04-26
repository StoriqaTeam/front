// @flow

import React from 'react';
import type { Node } from 'react';
import classNames from 'classnames';

import './SpinnerButton.scss';

type PropsTypes = {
  onClick: () => void,
  children: Node,
  isLoading: ?boolean,
  medium: ?boolean,
  small: ?boolean,
  white: ?boolean,
};

const Button = ({
  onClick,
  children,
  isLoading,
  white,
  medium,
  small,
}: PropsTypes) => (
  <button
    onClick={onClick}
    disabled={isLoading}
    styleName={classNames('container', {
      isLoading,
      white,
      medium,
      small,
    })}
    type="button"
  >
    <div styleName={classNames('spinner', { white: !white, small, medium })} />
    <span styleName="childrenWrapper">{children}</span>
  </button>
);

export default Button;
