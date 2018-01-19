import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class Button extends PureComponent {
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
        className={buttonClass}
        onClick={onClick}
      >
        {title}
      </button>
    );
  }
}

Button.propTypes = {
  title: PropTypes.string.isRequired,
  buttonClass: PropTypes.string,
  type: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

export default Button;
