// @flow

import React from 'react';

import './TextWithLabel.scss';

const TextWithLabel = (props: { label: string, text: string }) => (
  <div styleName="container">
    <div styleName="label">{props.label}</div>
    <div styleName="text">{props.text}</div>
  </div>
);

export default TextWithLabel;
