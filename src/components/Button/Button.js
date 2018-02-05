import React, { PureComponent } from 'react';

import './Button.scss';

type PropsTypes = {
  title: string,
  onClick: Function,
};

class Button extends PureComponent<PropsTypes> {
  render() {
    const { title, onClick } = this.props;
    return (
      <button
        styleName="button"
        type="button"
        onClick={onClick}
      >
        {title}
      </button>
    );
  }
}

export default Button;
