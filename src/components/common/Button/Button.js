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
  dataTest: string,
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
      load,
      contour,
      big,
      dataTest,
      white,
      wireframe,
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
      white,
      wireframe,
    });

    if (href) {
      return (
        <a styleName={styleName} data-test={dataTest} {...props}>
          {children}
        </a>
      );
    }
    return (
      <button
        styleName={styleName}
        disabled={disabled}
        type="button"
        data-test={dataTest}
        {...props}
      />
    );
  }
}

export default Button;
