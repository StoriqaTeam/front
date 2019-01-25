// @flow strict

import React, { PureComponent, Fragment } from 'react';

import { getExchangePrice } from 'utils';
import { ContextDecorator } from 'components/App';

import type { DirectoriesType, AllCurrenciesType } from 'types';

import '../OrderInvoice.scss';

import t from './i18n';

type PropsType = {
  total: number,
  currency: AllCurrenciesType,
  shipping: string,
  directories: DirectoriesType,
};

type StateType = {
  priceUsd: string | number,
};

class InvoiceTotal extends PureComponent<PropsType, StateType> {
  render() {
    const { total, currency, shipping, directories } = this.props;
    const { currencyExchange } = directories;
    const exchangePrice = getExchangePrice({
      price: total,
      currency,
      currencyExchange,
    });
    return (
      <Fragment>
        <div styleName="totalField">
          <div styleName="totalFieldItem" />
          <div styleName="totalFieldItem" />
          <div styleName="totalFieldItem" />
          <div styleName="totalFieldItem shipping">{t.shippingAndHandling}</div>
          <div styleName="totalFieldItem shipping">{shipping}</div>
        </div>
        <div styleName="totalField">
          <div styleName="totalFieldItem" />
          <div styleName="totalFieldItem" />
          <div styleName="totalFieldItem" />
          <div styleName="totalFieldItem total">{t.total}</div>
          <div styleName="totalFieldItem total">{`${total} ${currency}`}</div>
        </div>
        <div styleName="totalField">
          <div styleName="totalFieldItem" />
          <div styleName="totalFieldItem" />
          <div styleName="totalFieldItem" />
          <div styleName="totalFieldItem" />
          <div styleName="totalFieldItem equivalent">{exchangePrice}</div>
        </div>
      </Fragment>
    );
  }
}
export default ContextDecorator(InvoiceTotal);
