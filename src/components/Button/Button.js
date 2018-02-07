// @flow

import React, { PureComponent } from 'react';
import type { Node } from 'react';
import classNames from 'classnames';

import './Button.scss';

type PropsTypes = {
  children: Node,
  type: string,
  onClick: ?Function,
  disabled: boolean,
  iconic: boolean,
};

class Button extends PureComponent<PropsTypes> {
  render() {
    const {
      type,
      onClick,
      disabled,
      children,
      iconic,
    } = this.props;

    return (
      <button
        type={type}
        disabled={disabled}
        styleName={classNames('container', { iconic })}
        onClick={onClick}
      >
        {children}
      </button>
    );
  }
}

export default Button;
