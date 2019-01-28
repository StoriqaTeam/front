// @flow

import React, { PureComponent } from 'react';
import { head, propEq, map, find, equals } from 'ramda';
import moment from 'moment';

import { Select } from 'components/common/Select';
import { getCookie, setCookie } from 'utils';

import languages from 'translation/languages.json';

import './HeaderTop.scss';
import t from './i18n';

type PropsType = {
  setLang: (lang: string) => void,
  isShopCreated: boolean,
};

const currencyCookieName = 'CURRENCY';
const fiatCurrencyCookieName = 'FIAT_CURRENCY';

class HeaderTop extends PureComponent<PropsType> {
  constructor(props: PropsType) {
    super(props);

    this.setFiat();
    this.setCrypto();
  }

  setCrypto = () => {
    const actualCurrency = getCookie('CURRENCY');
    if (!actualCurrency) {
      setCookie('CURRENCY', 'STQ');
    }
  };

  setFiat = () => {
    const actualCurrency = getCookie('FIAT_CURRENCY');
    if (!actualCurrency) {
      setCookie('FIAT_CURRENCY', 'USD');
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
