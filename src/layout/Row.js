// @flow

import React from 'react';
import classNames from 'classnames';

import './Row.scss';

type PropsTypes = {
  withoutGrow: ?boolean,
  children: any,
  reverseSm: ?boolean,
  reverseMd: ?boolean,
  reverseLg: ?boolean,
  reverseXl: ?boolean,
};

const Row = ({
  withoutGrow,
  children,
  reverseSm,
  reverseMd,
  reverseLg,
  reverseXl,
}: PropsTypes) => (
  <div
    styleName={classNames('container', {
      withoutGrow,
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
