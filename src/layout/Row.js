// @flow

import React from 'react';
import classNames from 'classnames';

import './Row.scss';

type PropsTypes = {
  children: any,
  reverseSm: ?boolean,
  reverseMd: ?boolean,
  reverseLg: ?boolean,
  reverseXl: ?boolean,
};

const Row = ({
  children,
  reverseSm,
  reverseMd,
  reverseLg,
  reverseXl,
}: PropsTypes) => (
  <div
    styleName={classNames('container', {
      reverseSm,
      reverseMd,
      reverseLg,
      reverseXl,
    })}
  >
    {children}
  </div>
);

export default Row;
