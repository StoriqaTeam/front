// @flow

import React from 'react';
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

const titlesHashMap = {
  default: 'Information.',
  success: 'Success!',
  warning: 'Warning!',
  danger: 'Danger!',
};

const Alert = (props: AlertPropsType) => {
  const { type = 'default', text, link, createdAtTimestamp, onClick } = props;
  const title = propOr('Information.', type, titlesHashMap);
  return (
    <div styleName="container">
      <div styleName={classnames('leftEdge', type)} />
      <div styleName="titleContainer">
        <div styleName="title">{title}</div>
        <button
          onClick={() => {
            props.onClose(createdAtTimestamp);
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
            props.onClose(createdAtTimestamp);
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
};

Alert.defaultProps = {
  onClick: () => {},
};

export default Alert;
