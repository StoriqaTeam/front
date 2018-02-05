// @flow

import React, { PureComponent } from 'react';

import './Button.scss';

type PropsTypes = {
  title: string,
  buttonClass: string,
  type: string,
  onClick: Function,
  disabled: boolean,
};

class Button extends PureComponent<PropsTypes> {
  static defaultProps = {
    onClick: () => {},
    buttonClass: '',
    type: 'button',
    disabled: false,
  };

  render() {
    const { title, onClick, buttonClass } = this.props;
    const { type, disabled } = this.props;
    return (
      <button
        type={type}
        disabled={disabled}
        styleName={`container ${buttonClass}`}
        onClick={onClick}
      >
        {title}
      </button>
    );
  }
}

export default Button;
