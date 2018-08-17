// @flow

import React, { Component } from 'react';
import { find, propEq } from 'ramda';

import { Select } from 'components/common/Select';

import { translate } from 'translation/utils/translate';
import languages from 'translation/languages.json';

import './HeaderTop.scss';

type PropsType = {
  currentLocale: string,
  changeLocale: (lang: string) => void,
};

class HeaderTop extends Component<PropsType> {
  handleChangeLocale = (item: { id: string, label: string }) => {
    if (item && item.id) {
      this.props.changeLocale(item.id);
    }
  };

  render() {
    const { currentLocale } = this.props;
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
          <a href="_">{translate('header.help')}</a>
        </div>
        <div>
          <a href="/start-selling">{translate('header.sell_on_storiqa')}</a>
        </div>
      </div>
    );
  }
}

export default HeaderTop;
