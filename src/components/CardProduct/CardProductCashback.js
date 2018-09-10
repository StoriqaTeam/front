// @flow

import React from 'react';
import classNames from 'classnames';

import './CardProductCashback.scss';

type PropsType = {
  cashbackValue: string | number,
};

const CardProductCashback = ({ cashbackValue }: PropsType) => (
  <div styleName="cashbackWrapper">
    <div
      styleName={classNames('cashback', {
        noneCashback: !cashbackValue,
      })}
    >
      <b>Cashback</b>
      <b styleName="value">{`${cashbackValue || 0}%`}</b>
    </div>
  </div>
);

export default CardProductCashback;
