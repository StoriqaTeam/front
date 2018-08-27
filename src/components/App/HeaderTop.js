// @flow

import React, { PureComponent } from 'react';
import { head, prop, propOr, map, find, whereEq, omit } from 'ramda';
import moment from 'moment';

import { Select } from 'components/common/Select';
import { getCookie, setCookie } from 'utils';

import './HeaderTop.scss';

const currencyCookieName = 'CURRENCY';

type PropsType = {
  // eslint-disable-next-line
  currencies: Array<Object>,
};

type CurrencyType = {
  key: number,
  code: string,
};

class HeaderTop extends PureComponent<PropsType> {
  componentDidMount() {
    // set STQ (or first currency in array) as selected currency if no currency was set before
    const currencies = propOr([], 'currencies', this.props);
    const currentCurrency: ?CurrencyType = getCookie(currencyCookieName);
    if (!currentCurrency) {
      // try to get stq
      const stq = find(whereEq({ code: 'STQ' }), currencies);
      if (stq) {
        setCookie(
          currencyCookieName,
          omit(['name'], stq),
          moment()
            .utc()
            .add(7, 'd')
            .toDate(),
        );
      } else {
        const firstCurrency = head(currencies);
        if (firstCurrency) {
          setCookie(
            currencyCookieName,
            omit(['name'], firstCurrency),
            moment()
              .utc()
              .add(7, 'd')
              .toDate(),
          );
        }
      }
    }
  }

  getCurrenciesItems = (): Array<{ id: string, label: string }> =>
    map(
      item => ({
        id: prop('code', item),
        label: prop('code', item),
      }),
      this.props.currencies,
    );

  getCurrentCurrencyAsItem = (): ?{ id: string, label: string } => {
    const currency = getCookie(currencyCookieName);
    if (currency) {
      return {
        id: currency.code,
        label: currency.code,
      };
    }
    const firstCurrency = head(this.props.currencies);
    return (
      firstCurrency && {
        id: firstCurrency.code,
        label: firstCurrency.code,
      }
    );
  };

  handleSelect = (value: { id: string, label: string }) => {
    const currency = find(whereEq({ code: value.id }), this.props.currencies);
    if (currency) {
      setCookie(
        currencyCookieName,
        omit(['name'], currency),
        moment()
          .utc()
          .add(7, 'd')
          .toDate(),
      );
      window.location.reload(true);
    }
  };

  render() {
    return (
      <div styleName="container">
        <div styleName="item">
          <Select
            activeItem={
              this.getCurrentCurrencyAsItem() || head(this.getCurrenciesItems())
            }
            items={this.getCurrenciesItems()}
            onSelect={this.handleSelect}
            dataTest="headerСurrenciesSelect"
          />
        </div>
        <div styleName="item">
          <Select
            activeItem={{ id: '1', label: 'ENG' }}
            items={[{ id: '1', label: 'ENG' }]}
            onSelect={() => {}}
            dataTest="headerLanguagesSelect"
          />
        </div>
        <div>
          <a href="_">Help</a> {/* eslint-disable-line */}
        </div>
        <div>
          <a href="/start-selling">Sell on Storiqa</a>
        </div>
      </div>
    );
  }
}

export default HeaderTop;
