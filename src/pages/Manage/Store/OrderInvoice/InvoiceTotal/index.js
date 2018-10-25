// @flow strict
import React, { Fragment } from 'react';

import '../OrderInvoice.scss';

import t from './i18n';

type PropsType = {
  total: string,
  shipping: string,
};

const InvoiceTotal = ({ total, shipping }: PropsType) => (
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
      <div styleName="totalFieldItem total">{total}</div>
    </div>
  </Fragment>
);

export default InvoiceTotal;
