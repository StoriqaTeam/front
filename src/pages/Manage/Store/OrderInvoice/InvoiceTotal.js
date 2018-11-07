// @flow strict
import React, { Component, Fragment } from 'react';
import { head } from 'ramda';
// $FlowIgnoreMe
import axios from 'axios';

import { log } from 'utils';

import './OrderInvoice.scss';

type PropsType = {
  total: string,
  shipping: string,
  currencyCode: string,
};

type StateType = {
  priceUsd: string | number,
};

class InvoiceTotal extends Component<PropsType, StateType> {
  state = {
    priceUsd: 0,
  };
  componentDidMount() {
    const { total } = this.props;
    axios
      .get('https://api.coinmarketcap.com/v1/ticker/storiqa/')
      .then(({ data }) => {
        const dataObj = head(data);
        if (dataObj) {
          const priceUsd = (
            parseInt(total, 10) * Number(dataObj.price_usd)
          ).toFixed(2);
          this.setState({ priceUsd });
        }
      })
      .catch(error => {
        log.debug(error);
      });
  }
  render() {
    const { total, shipping, currencyCode } = this.props;
    const { priceUsd } = this.state;
    return (
      <Fragment>
        <div styleName="totalField">
          <div styleName="totalFieldItem" />
          <div styleName="totalFieldItem" />
          <div styleName="totalFieldItem" />
          <div styleName="totalFieldItem shipping">SHIPPING & HANDLING</div>
          <div styleName="totalFieldItem shipping">{shipping}</div>
        </div>
        <div styleName="totalField">
          <div styleName="totalFieldItem" />
          <div styleName="totalFieldItem" />
          <div styleName="totalFieldItem" />
          <div styleName="totalFieldItem total">TOTAL</div>
          <div styleName="totalFieldItem total">{total}</div>
        </div>
        <div styleName="totalField">
          <div styleName="totalFieldItem" />
          <div styleName="totalFieldItem" />
          <div styleName="totalFieldItem" />
          <div styleName="totalFieldItem" />
          <div styleName="totalFieldItem equivalent">{`${priceUsd} ${currencyCode}`}</div>
        </div>
      </Fragment>
    );
  }
}
export default InvoiceTotal;
