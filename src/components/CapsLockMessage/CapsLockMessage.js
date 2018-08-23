// @flow

import React from 'react';

import './CapsLockMessage.scss';

type PropTypes = {
  text: string,
};

const CapsLockMessage = (props: PropTypes) => (
  <div styleName="container">{props.text}</div>
);

export default CapsLockMessage;
