// @flow strict

import React, { Component } from 'react';
import classnames from 'classnames';
import { propOr, isEmpty } from 'ramda';

import CloseIcon from './svg/close_icon.svg';

import './Alert.scss';

import type { AlertPropsType } from './types';

type StateType = {
  isDisappearing: boolean,
};

const titlesHashMap = {
  default: 'Information.',
  success: 'Success!',
  warning: 'Warning!',
  danger: 'Attention!',
};

class Alert extends Component<AlertPropsType, StateType> {
  state: StateType = {
    isDisappearing: false,
  };

  componentDidMount() {
    setTimeout(() => {
      this.props.onClose(this.props.createdAtTimestamp);
    }, 3000);
    setTimeout(() => {
      this.setState({ isDisappearing: true });
    }, 1500);
  }

  render() {
    const {
      type = 'default',
      text,
      link,
      createdAtTimestamp,
      onClick,
    } = this.props;
    const title = propOr('Information.', type, titlesHashMap);
    return (
      <div
        styleName={classnames('container', {
          disappering: this.state.isDisappearing,
          default: type === 'default',
          success: type === 'success',
          danger: type === 'danger',
          warning: type === 'warning',
        })}
      >
        <button
          name="alertCloseButton"
          onClick={() => {
            this.props.onClose(createdAtTimestamp);
            if (onClick) {
              onClick();
            }
          }}
          styleName="closeButton"
        >
          <CloseIcon />
        </button>
        {/* <div styleName={classnames('leftEdge', type)} /> */}
        <div styleName="titleContainer">
          <div styleName="title">{title}</div>
        </div>
        <div styleName="alertMessage">{text}</div>
        <div styleName="link">
          {!isEmpty(link.text) ? (
            <button
              styleName="buttonLink"
              onClick={() => {
                this.props.onClose(createdAtTimestamp);
                if (onClick) {
                  onClick();
                }
              }}
            >
              <span styleName="link">{link.text}</span>
            </button>
          ) : null}
        </div>
      </div>
    );
  }
}

export default Alert;
