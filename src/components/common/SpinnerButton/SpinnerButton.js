// @flow

import React from 'react';
import type { Node } from 'react';
import classNames from 'classnames';

import './SpinnerButton.scss';

type PropsTypes = {
  children: Node,
  medium: ?boolean,
  small: ?boolean,
  white: ?boolean,
};

const Button = ({
  children,
  white,
  medium,
  small,
}: PropsTypes) => (
  <button
    disabled
    styleName={classNames('container', {
      white,
      medium,
      small,
    })}
    type="button"
  >
    <div styleName={classNames('spinner', { white: !white, small, medium })} />
    <span styleName="childrenWrapper">{children}</span>
    <div styleName={classNames('spinner', 'spinnerHover', { white: !white, small, medium })} />
  </button>
);

export default Button;
