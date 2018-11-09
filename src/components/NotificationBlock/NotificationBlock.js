// @flow strict

import React, { PureComponent } from 'react';
import classnames from 'classnames';
import { isEmpty } from 'ramda';

import CloseIcon from './svg/close_icon.svg';

import './NotificationBlock.scss';

type PropsType = {
  isDisappearing: boolean,
  isStatic: boolean,
  link: {
    text: string,
  },
  longText: boolean,
  text: string,
  title: string,
  type: string,
  onClick: () => void,
  hideCloseButton: boolean,
};

class NotificationBlock extends PureComponent<PropsType> {
  static defaultProps = {
    isStatic: false,
    isDisappearing: false,
    longText: false,
    hideCloseButton: false,
  };

  render() {
    const {
      title,
      type,
      isDisappearing,
      isStatic,
      text,
      longText,
      link,
      onClick,
      hideCloseButton,
    } = this.props;
    return (
      <div
        styleName={classnames('container', {
          disappering: isDisappearing,
          default: type === 'default',
          success: type === 'success',
          danger: type === 'danger',
          warning: type === 'warning',
        })}
      >
        {!hideCloseButton ? (
          <button
            name="alertCloseButton"
            onClick={() => {}}
            styleName="closeButton"
          >
            <CloseIcon />
          </button>
        ) : null}
        {!isStatic ? (
          <div styleName="titleContainer">
            <div styleName="title">{title}</div>
          </div>
        ) : null}
        <div styleName={classnames('alertMessage', { longText })}>{text}</div>
        <div styleName="link">
          {!isEmpty(link.text) ? (
            <button styleName="buttonLink" onClick={onClick}>
              <span styleName="link">{link.text}</span>
            </button>
          ) : null}
        </div>
      </div>
    );
  }
}

export default NotificationBlock;
