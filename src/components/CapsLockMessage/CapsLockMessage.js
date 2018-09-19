// @flow strict

import React from 'react';
import type { Element } from 'react';

import './CapsLockMessage.scss';

type PropTypes = {
  text?: string,
};

const CapsLockMessage = (props: PropTypes): Element<'div'> => (
  <div styleName="container">{props.text}</div>
);

CapsLockMessage.defaultProps = {
  text: '',
};

export default CapsLockMessage;
