// @flow strict

import React from 'react';
import classNames from 'classnames';

import './CardProductCashback.scss';

import t from './i18n';

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
      <b>{t.cashback}</b>
      <b styleName="value">{`${cashbackValue || 0}%`}</b>
    </div>
  </div>
);

export default CardProductCashback;
