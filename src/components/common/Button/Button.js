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
  wireframe?: boolean,
  load?: boolean,
  contour: ?boolean,
  big: ?boolean,
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
      load,
      contour,
      big,
    } = this.props;

    const props = {
      type,
      disabled,
      onClick,
      href,
      children,
    };

    const styleName = classNames('container', {
      iconic,
      disabled,
      load,
      contour,
      big,
      contour,
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
