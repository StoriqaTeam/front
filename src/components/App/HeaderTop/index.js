// @flow

import React, { PureComponent } from 'react';
import { head, propOr, propEq, map, find, equals, pathOr } from 'ramda';
import moment from 'moment';

import { Select } from 'components/common/Select';
import { getCookie, setCookie } from 'utils';

import languages from 'translation/languages.json';

import './HeaderTop.scss';
import t from './i18n';

type PropsType = {
  setLang: (lang: string) => void,
  /* eslint-disable react/no-unused-prop-types */
  cryptoCurrencies: Array<string>,
  /* eslint-disable react/no-unused-prop-types */
  fiatCurrencies: Array<string>,
  isShopCreated: boolean,
};

const currencyCookieName = 'CURRENCY';
const fiatCurrencyCookieName = 'FIAT_CURRENCY';

type CurrencyType = {
  key: number,
  code: string,
};

class HeaderTop extends PureComponent<PropsType> {
  componentWillMount() {
    // set STQ (or first currency in array) as selected currency if no currency was set before
    const cryptoCurrencies = propOr([], 'cryptoCurrencies', this.props);
    // $FlowIgnore
    const urlCurrency = pathOr(
      null,
      ['match', 'location', 'query', 'currency'],
      this.props,
    );

    if (urlCurrency) {
      const foundCurrency = find(equals(urlCurrency), cryptoCurrencies);
      if (foundCurrency) {
        setCookie(
          currencyCookieName,
          foundCurrency,
          moment()
            .utc()
            .add(7, 'd')
            .toDate(),
        );
        return;
      }
    }

    const currentCurrency: ?CurrencyType = getCookie(currencyCookieName);
    const currentFiatCurrency: ?CurrencyType = getCookie(
      fiatCurrencyCookieName,
    );

    this.setCookieCurrency(currentCurrency, 'crypto', 'STQ');
    this.setCookieCurrency(currentFiatCurrency, 'fiat', 'USD');
  }

  setCookieCurrency = (
    currentCurrency: string,
    prefix: Array<string>,
    defaultCurrency: string,
  ): void => {
    const currencies = map(item => item.id, this.getCurrenciesItems(prefix));
    if (!currentCurrency) {
      // try to get currency
      const currency = find(equals(defaultCurrency), currencies);
      if (currency) {
        setCookie(
          currencyCookieName,
          currency,
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
  };

  getCurrenciesItems = (
    prefix: string = 'crypto',
  ): Array<{ id: string, label: string }> => {
    const currencyProp = `${prefix}Currencies`;
    return map(
      item => ({
        id: item,
        label: item,
      }),
      this.props[currencyProp],
    );
  };

  getCurrentCurrencyAsItem = (
    prefix: string = 'crypto',
  ): ?{ id: string, label: string } => {
    const cookie =
      prefix === 'crypto' ? currencyCookieName : fiatCurrencyCookieName;
    const currencyProp = `${prefix}Currencies`;
    const currency = getCookie(cookie);
    if (currency) {
      return {
        id: currency,
        label: currency,
      };
    }
    const firstCurrency: ?string = head(this.props[currencyProp]);

    if (firstCurrency) {
      return {
        id: firstCurrency,
        label: firstCurrency,
      };
    }
    return null;
  };

  getCookieName = (prefix: string): string =>
    prefix === 'crypto' ? currencyCookieName : fiatCurrencyCookieName;

  handleChangeLocale = (item: { id: string, label: string }) => {
    if (item && item.id) {
      this.props.setLang(item.id);
    }
  };

  handleSelect = (value: { id: string, label: string }, prefix: string) => {
    const currencyProp = `${prefix}Currencies`;
    const currency = find(equals(value.id), this.props[currencyProp]);
    const cookieName = this.getCookieName(prefix);
    if (currency) {
      setCookie(
        cookieName,
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
    const currentLocale = getCookie('locale') || 'en';
    const activeLocaleItem = find(propEq('id', currentLocale))(languages);
    const { isShopCreated } = this.props;
    return (
      <div styleName="container">
        <div styleName="item">
          <Select
            activeItem={
              this.getCurrentCurrencyAsItem('fiat') ||
              head(this.getCurrenciesItems('fiat'))
            }
            items={this.getCurrenciesItems('fiat')}
            onSelect={item => {
              this.handleSelect(item, 'fiat');
            }}
            dataTest="headerFiatСurrenciesSelect"
          />
        </div>
        <div styleName="item">
          <Select
            activeItem={
              this.getCurrentCurrencyAsItem('crypto') ||
              head(this.getCurrenciesItems('crypto'))
            }
            items={this.getCurrenciesItems('crypto')}
            onSelect={item => {
              this.handleSelect(item, 'crypto');
            }}
            dataTest="headerСurrenciesSelect"
          />
        </div>
        <div styleName="item">
          <Select
            activeItem={activeLocaleItem}
            items={[{ id: 'en', label: 'ENG' }]}
            onSelect={this.handleChangeLocale}
            dataTest="headerLanguagesSelect"
          />
        </div>
        <div>
          <a
            href="https://storiqa.zendesk.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            {t.help}
          </a>
        </div>
        <div>
          {isShopCreated ? null : (
            <a href="https://selling.storiqa.com/">{t.startSelling}</a>
          )}
        </div>
      </div>
    );
  }
}

export default HeaderTop;
