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
  static defaultProps = {
    isStatic: false,
    longText: false,
  };

  state = {
    isDisappearing: false,
  };

  componentDidMount() {
    const { isStatic } = this.props;
    // $FlowIgnoreMe
    if (!isStatic) {
      this.alertTimer = setTimeout(() => {
        this.props.onClose(this.props.createdAtTimestamp);
      }, 5000);
    }
  }

  componentWillUnmount() {
    if (this.alertTimer) {
      clearTimeout(this.alertTimer);
    }
  }

  onMouseOver = () => {
    if (this.alertTimer) {
      clearTimeout(this.alertTimer);
    }
  };

  onMouseOut = () => {
    this.alertTimer = setTimeout(() => {
      this.props.onClose(this.props.createdAtTimestamp);
    }, 5000);
  };

  alertTimer: TimeoutID;

  render() {
    const {
      type = 'default',
      text,
      link,
      createdAtTimestamp,
      onClick,
      isStatic,
      longText,
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
        onMouseOver={this.onMouseOver}
        onMouseOut={this.onMouseOut}
        onBlur={() => {}}
        onFocus={() => {}}
      >
        {/* $FlowIgnoreMe */}
        {!isStatic ? (
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
        ) : null}
        {/* <div styleName={classnames('leftEdge', type)} /> */}
        {/* $FlowIgnoreMe */}
        {!isStatic ? (
          <div styleName="titleContainer">
            <div styleName="title">{title}</div>
          </div>
        ) : null}
        <div styleName={classnames('alertMessage', { longText })}>{text}</div>
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
