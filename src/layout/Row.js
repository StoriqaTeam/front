// @flow

import React from 'react';
import classNames from 'classnames';

import './Row.scss';

type PropsTypes = {
  children: any,
  withoutGrow?: boolean,
  reverseSm?: boolean,
  reverseMd?: boolean,
  reverseLg?: boolean,
  reverseXl?: boolean,
  noWrap?: boolean,
};

const Row = ({
  withoutGrow,
  children,
  reverseSm,
  reverseMd,
  reverseLg,
  reverseXl,
  noWrap,
}: PropsTypes) => (
  <div
    styleName={classNames('container', {
      withoutGrow,
      reverseSm,
      reverseMd,
      reverseLg,
      reverseXl,
      //
      noWrap,
    })}
  >
    {children}
  </div>
);

Row.defaultProps = {
  reverseSm: false,
  reverseMd: false,
  reverseLg: false,
  reverseXl: false,
  noWrap: false,
  withoutGrow: false,
};

export default Row;
