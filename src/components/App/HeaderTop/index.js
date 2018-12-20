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
  currencies: Array<string>,
  isShopCreated: boolean,
};

const currencyCookieName = 'CURRENCY';

type CurrencyType = {
  key: number,
  code: string,
};

class HeaderTop extends PureComponent<PropsType> {
  componentWillMount() {
    // set STQ (or first currency in array) as selected currency if no currency was set before
    // $FlowIgnore
    const currencies = propOr([], 'currencies', this.props);
    // $FlowIgnore
    const urlCurrency = pathOr(
      null,
      ['match', 'location', 'query', 'currency'],
      this.props,
    );
    if (urlCurrency) {
      const foundCurrency = find(equals(urlCurrency), currencies);
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

  handleChangeLocale = (item: { id: string, label: string }) => {
    if (item && item.id) {
      this.props.setLang(item.id);
    }
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
    const currentLocale = getCookie('locale') || 'en';
    const activeLocaleItem = find(propEq('id', currentLocale))(languages);
    const { isShopCreated } = this.props;
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
