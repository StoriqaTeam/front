// @flow

import React from 'react';
import classNames from 'classnames';

import './Spinner.scss';

type PropsType = {
  white: ?boolean,
}

const Spinner = ({ white }: PropsType) => (
  <div
    styleName={classNames('spinner', { white })}
  />
);

export default Spinner;
