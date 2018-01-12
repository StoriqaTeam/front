import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class Button extends PureComponent {
  static defaultProps = {
    onClick: () => {},
    buttonClass: 'Button',
  };

  render() {
    const { title, onClick, buttonClass } = this.props;
    return <button type="button" className={buttonClass} onClick={onClick}>{title}</button>;
  }
}

Button.propTypes = {
  title: PropTypes.string.isRequired,
  buttonClass: PropTypes.string,
  onClick: PropTypes.func,
};

export default Button;
