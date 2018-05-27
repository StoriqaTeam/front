// @flow

import React from 'react';
import classNames from 'classnames';

import './Count.scss';

type PropsTypes = {
  amount: number,
  styles: string,
  tip: boolean,
  dataTestId?: string,
};

const Count = ({ amount, styles, tip, dataTestId }: PropsTypes) => (
  <div
    styleName={classNames('container', styles, { tip })}
    data-test={dataTestId}
  >
    <strong>{amount}</strong>
  </div>
);

Count.defaultProps = {
  dataTestId: '',
};

export default Count;
