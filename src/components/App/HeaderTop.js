import React, { PureComponent } from 'react';
import { head, prop, propOr, map, find, whereEq } from 'ramda';

import { AppContext } from 'components/App';
import { Select } from 'components/common/Select';
import { getCookie, setCookie } from 'utils';

import './HeaderTop.scss';

const currencyIdCookieName = 'CURRENCY_ID';

type PropsType = {
  // eslint-disable-next-line
  currencies: Array<Object>,
};

class HeaderTop extends PureComponent<PropsType> {
  componentDidMount() {
    // set STQ (or first currency in array) as selected currency if no currency was set before
    const currencies = propOr([], 'currencies', this.props);
    const currentCurrencyId = getCookie(currencyIdCookieName);
    if (!currentCurrencyId) {
      // try to get stq
      const stq = find(whereEq({ name: 'stq' }), currencies);
      if (stq) {
        setCookie(currencyIdCookieName, stq.key);
      } else {
        const firstCurrency = head(currencies);
        if (firstCurrency) {
          setCookie(currencyIdCookieName, firstCurrency.key);
        }
      }
    }
  }

  getCurrenciesItems: Array<{ id: string, label: string }> = map(item => ({
    id: String(prop('key', item)),
    label: prop('name', item),
  }));

  getItemById = (id: string) => (list: Array<any>) => {
    const currency = find(whereEq({ key: parseInt(id, 10) }), list);
    if (currency) {
      return {
        id: String(prop('key', currency)),
        label: prop('name', currency),
      };
    }
    return null;
  };

  handleSelect = (value: any) => {
    setCookie(currencyIdCookieName, value.id);
    window.location.reload(true);
  };

  render() {
    return (
      <AppContext.Consumer>
        {({ directories: { currencies } }) => (
          <div styleName="container">
            <div styleName="item">
              <Select
                activeItem={
                  this.getItemById(getCookie(currencyIdCookieName))(
                    currencies,
                  ) || head(this.getCurrenciesItems(currencies))
                }
                items={this.getCurrenciesItems(currencies)}
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
        )}
      </AppContext.Consumer>
    );
  }
}

export default HeaderTop;
