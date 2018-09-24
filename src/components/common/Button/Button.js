// @flow strict

import React, { PureComponent } from 'react';
import type { Node } from 'react';
import classNames from 'classnames';

import { Icon } from 'components/Icon';

import './Button.scss';

type PropsTypes = {
  children: Node,
  type: string,
  onClick: () => void,
  disabled: boolean,
  iconic: boolean,
  href: string,
  wireframe: boolean,
  load?: boolean,
  contour: boolean,
  small: boolean,
  big: boolean,
  dataTest: string,
  white: boolean,
  isLoading: boolean,
  pink: boolean,
  fullWidth?: boolean,
  add?: boolean,
};

class Button extends PureComponent<PropsTypes> {
  static defaultProps = {
    isLoading: false,
    disabled: false,
    href: '',
    contour: false,
    small: false,
    big: false,
    iconic: false,
    white: false,
    pink: false,
    wireframe: false,
    onClick: () => {},
    type: 'button',
    dataTest: 'stqButton',
  };
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
      small,
      dataTest,
      white,
      wireframe,
      isLoading,
      pink,
      fullWidth,
      add,
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
      small,
      white,
      wireframe,
      isLoading,
      pink,
      fullWidth,
      add,
      transparent: isLoading,
    });

    if (href !== '') {
      return (
        <a styleName={styleName} data-test={dataTest} {...props}>
          {children}
        </a>
      );
    }
    return (
      <button
        styleName={styleName}
        disabled={disabled || isLoading}
        type="button"
        data-test={dataTest}
        {...props}
      >
        <div styleName="spinner" />
        <div styleName="children">{children}</div>
        {add && (
          <div styleName="plusIcon">
            <Icon type="plus" size={24} />
          </div>
        )}
      </button>
    );
  }
}

export default Button;
