// @flow strict

import React from 'react';

import './SpinnerCircle.scss';

type PropsType = {
  additionalStyles: { [string]: number | string | boolean },
  containerStyles: { [string]: number | string | boolean },
};

const SpinnerCircle = (props: PropsType) => (
  <div styleName="container" style={props.containerStyles}>
    <div styleName="spinner" style={props.additionalStyles} />
  </div>
);

export default SpinnerCircle;
