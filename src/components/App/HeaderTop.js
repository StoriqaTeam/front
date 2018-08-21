// @flow

import React, { Component } from 'react';

import { Select } from 'components/common/Select';

import './HeaderTop.scss';

class HeaderTop extends Component<{}> {
  handleSelect = () => {};
  render() {
    return (
      <div styleName="container">
        <div styleName="item">
          <Select
            activeItem={{ id: '3', label: 'STQ' }}
            items={[{ id: '3', label: 'STQ' }]}
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
