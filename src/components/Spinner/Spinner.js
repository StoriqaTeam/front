// @flow

import React from 'react';

import './Spinner.scss';

type PropsType = {
  size: ?number,
}

const Spinner = ({ size }: PropsType) => (
  <div
    styleName="loader"
    style={{ width: size && `${size}rem`, height: size && `${size}rem` }}
  />
);

export default Spinner;
