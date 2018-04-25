// @flow

import React, { PureComponent } from 'react';
import type { Node } from 'react';
import classNames from 'classnames';

import './SpinnerButton.scss';

type PropsTypes = {
  children: Node,
  medium: ?boolean,
  small: ?boolean,
  white: ?boolean,
};

class Button extends PureComponent<PropsTypes> {
  render() {
    const {
      children,
      white,
      medium,
      small,
    } = this.props;
    return (
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
      </button>
    );
  }
}

export default Button;
