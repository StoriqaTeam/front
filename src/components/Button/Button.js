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
  href: ?string,
  isDefault?: boolean,
  wireframe?: boolean,
  white: ?boolean,
};

class Button extends PureComponent<PropsTypes> {
  render() {
    const {
      type,
      onClick,
      disabled,
      children,
      iconic,
      href,
      isDefault,
      wireframe,
      white,
    } = this.props;

    const props = {
      type,
      disabled,
      onClick,
      href,
      children,
      white,
    };

    const styleName = classNames('container', {
      iconic,
      disabled,
      isDefault,
      wireframe,
      white,
    });

    if (href) {
      return (<a styleName={styleName} {...props}>{children}</a>);
    }
    return (<button
      styleName={styleName}
      disabled={disabled}
      type="button"
      {...props}
    />);
  }
}

export default Button;
