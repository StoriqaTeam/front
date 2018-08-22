import React, { Component } from 'react';
import { head, prop, map, find, whereEq } from 'ramda';

import { AppContext } from 'components/App';
import { Select } from 'components/common/Select';
import { getCookie, setCookie } from 'utils';

import './HeaderTop.scss';

class HeaderTop extends Component {
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
    setCookie('Currency-Id', value.id);
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
                  this.getItemById(getCookie('Currency-Id'))(currencies) ||
                  head(this.getCurrenciesItems(currencies))
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
