import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class Button extends PureComponent {
  static defaultProps = {
    onClick: () => {},
  };

  render() {
    const { title, onClick } = this.props;
    return <button type="button" className="Button" onClick={onClick}>{title}</button>;
  }
}

Button.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default Button;
