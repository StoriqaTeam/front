// @flow

import React, { PureComponent } from 'react';
import { head, propOr, map, find, equals } from 'ramda';
import moment from 'moment';

import { Select } from 'components/common/Select';
import { getCookie, setCookie } from 'utils';

import './HeaderTop.scss';

const currencyCookieName = 'CURRENCY';

type PropsType = {
  // eslint-disable-next-line
  currencies: Array<string>,
};

type CurrencyType = {
  key: number,
  code: string,
};

class HeaderTop extends PureComponent<PropsType> {
  componentWillMount() {
    // set STQ (or first currency in array) as selected currency if no currency was set before
    const currencies = propOr([], 'currencies', this.props);
    const currentCurrency: ?CurrencyType = getCookie(currencyCookieName);
    if (!currentCurrency) {
      // try to get stq
      const stq = find(equals('STQ'), currencies);
      if (stq) {
        setCookie(
          currencyCookieName,
          stq,
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
            firstCurrency,
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
        id: item,
        label: item,
      }),
      this.props.currencies,
    );

  getCurrentCurrencyAsItem = (): ?{ id: string, label: string } => {
    const currency = getCookie(currencyCookieName);
    if (currency) {
      return {
        id: currency,
        label: currency,
      };
    }
    const firstCurrency: ?string = head(this.props.currencies);

    if (firstCurrency) {
      return {
        id: firstCurrency,
        label: firstCurrency,
      };
    }
    return null;
  };

  handleSelect = (value: { id: string, label: string }) => {
    const currency = find(equals(value.id), this.props.currencies);
    if (currency) {
      setCookie(
        currencyCookieName,
        currency,
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
          <a href="/start-selling">
            Sell on Storiqa
          </a>
        </div>
      </div>
    );
  }
}

export default HeaderTop;
