// @flow

import React, { Component } from 'react';
import classnames from 'classnames';
import { propOr } from 'ramda';

import CloseIcon from './svg/close_icon.svg';

import './Alert.scss';

export type AlertType = 'default' | 'success' | 'warning' | 'danger';

export type AlertPropsType = {
  createdAtTimestamp: number,
  type: AlertType,
  text: string,
  link: { text: string, path?: string },
  onClose: (timestamp: number) => void,
  onClick?: () => void,
};

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
        })}
      >
        <div styleName={classnames('leftEdge', type)} />
        <div styleName="titleContainer">
          <div styleName="title">{title}</div>
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
        </div>
        <div styleName="alertMessage">{text}</div>
        <div styleName="link">
          <button
            onClick={() => {
              this.props.onClose(createdAtTimestamp);
              if (onClick) {
                onClick();
              }
            }}
          >
            <span styleName="link">{link.text}</span>
          </button>
        </div>
      </div>
    );
  }
}

export default Alert;
