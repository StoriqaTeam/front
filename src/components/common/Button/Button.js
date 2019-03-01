// @flow strict

import React, { PureComponent } from 'react';
import type { Node } from 'react';
import classNames from 'classnames';
import { dissoc } from 'ramda';

import { Icon } from 'components/Icon';

import './Button.scss';

type PropsTypes = {
  children: Node,
  type: string,
  onClick: () => void,
  onMouseDown?: () => void,
  disabled: boolean,
  iconic: boolean,
  href: string,
  wireframe: boolean,
  load?: boolean,
  contour: boolean,
  small: boolean,
  extraSmall: boolean,
  big: boolean,
  dataTest: string,
  white: boolean,
  isLoading: boolean,
  pink: boolean,
  fullWidth?: boolean,
  add: boolean,
  target?: string,
};

class Button extends PureComponent<PropsTypes> {
  static defaultProps = {
    isLoading: false,
    disabled: false,
    href: '',
    contour: false,
    small: false,
    extraSmall: false,
    big: false,
    iconic: false,
    white: false,
    pink: false,
    wireframe: false,
    onClick: () => {},
    type: 'button',
    dataTest: 'stqButton',
    add: false,
    target: '_self',
  };
  render() {
    const {
      type,
      onClick,
      onMouseDown,
      disabled,
      children,
      iconic,
      href,
      load,
      contour,
      big,
      small,
      extraSmall,
      dataTest,
      white,
      wireframe,
      isLoading,
      pink,
      fullWidth,
      add,
      target,
    } = this.props;

    const props = {
      type,
      disabled,
      onClick,
      onMouseDown,
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
      extraSmall,
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
        <a
          styleName={styleName}
          data-test={dataTest}
          target={target}
          {...props}
        >
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
        {...dissoc('href', props)}
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
