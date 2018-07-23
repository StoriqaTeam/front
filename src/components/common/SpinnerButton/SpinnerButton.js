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
  dataTest: string,
  disabled: ?boolean,
};

const SpinerButton = ({
  onClick,
  children,
  isLoading,
  white,
  medium,
  small,
  dataTest,
  disabled,
}: PropsTypes) => (
  <button
    onClick={onClick}
    disabled={isLoading || disabled}
    styleName={classNames('container', {
      isLoading,
      white,
      medium,
      small,
      disabled,
    })}
    type="button"
    data-test={dataTest}
  >
    <div styleName={classNames('spinner', { white: !white, small, medium })} />
    <span styleName="childrenWrapper">{children}</span>
  </button>
);

export default SpinerButton;
