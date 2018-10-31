// @flow strict

import React from 'react';
import type { Node } from 'react';
import classNames from 'classnames';

import './Row.scss';

type PropsType = {
  children: Node,
  withoutGrow?: boolean,
  reverseSm?: boolean,
  reverseMd?: boolean,
  reverseLg?: boolean,
  reverseXl?: boolean,
  noWrap?: boolean,
  alignItems?: string,
};

const Row = ({
  withoutGrow,
  children,
  reverseSm,
  reverseMd,
  reverseLg,
  reverseXl,
  noWrap,
  alignItems,
}: PropsType) => (
  <div
    styleName={classNames('container', {
      withoutGrow,
      reverseSm,
      reverseMd,
      reverseLg,
      reverseXl,
      noWrap,
      alignItemsCenter: alignItems === 'center',
    })}
  >
    {children}
  </div>
);

Row.defaultProps = {
  withoutGrow: false,
  reverseSm: false,
  reverseMd: false,
  reverseLg: false,
  reverseXl: false,
  noWrap: false,
  alignItems: undefined,
};

export default Row;
