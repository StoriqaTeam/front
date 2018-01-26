// @flow

import React, { PureComponent } from 'react';

import './Button.scss';

type PropsTypes = {
  title: string,
  buttonClass: PropTypes.string,
  type: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

class Button extends PureComponent<PropsTypes> {
  static defaultProps = {
    onClick: () => {},
    buttonClass: 'Button',
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
        styleName={`${buttonClass || ''}`}
        onClick={onClick}
      >
        {title}
      </button>
    );
  }
}

export default Button;
