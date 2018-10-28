// @flow strict

import React from 'react';

import './SpinnerCircle.scss';

type PropsType = {
  additionalStyles?: { [string]: string | number | boolean },
  containerStyles?: { [string]: string | number | boolean },
};

const SpinnerCircle = (props: PropsType) => (
  <div styleName="container" style={props.containerStyles}>
    <div styleName="spinner" style={props.additionalStyles} />
  </div>
);

SpinnerCircle.defaultProps = {
  additionalStyles: {},
  containerStyles: {},
};

export default SpinnerCircle;
