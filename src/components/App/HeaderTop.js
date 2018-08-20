// @flow

import React, { Component } from 'react';
import { find, propEq, pathOr } from 'ramda';

import { Select } from 'components/common/Select';

import { getCookie } from 'utils';
import { t } from 'translation/utils';
import languages from 'translation/languages.json';

import './HeaderTop.scss';

type PropsType = {
  setLang: (lang: string) => void,
};

class HeaderTop extends Component<PropsType> {
  handleChangeLocale = (item: { id: string, label: string }) => {
    if (item && item.id) {
      this.props.setLang(item.id);
    }
  };

  render() {
    const currentLocale = pathOr('en', ['value'], getCookie('locale'));
    const activeLocaleItem = find(propEq('id', currentLocale))(languages);
    return (
      <div styleName="container">
        <div styleName="item">
          <Select
            activeItem={{ id: '3', label: 'STQ' }}
            items={[{ id: '3', label: 'STQ' }]}
            onSelect={() => {}}
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
          <a href="_">{t('header.help')}</a>
        </div>
        <div>
          <a href="/start-selling">{t('header.sell_on_storiqa')}</a>
        </div>
      </div>
    );
  }
}

export default HeaderTop;
