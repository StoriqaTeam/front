import React, { Component } from 'react';

import { Select } from 'components/common/Select';

import './HeaderTop.scss';

class HeaderTop extends Component {
  handleSelect = () => {};
  render() {
    return (
      <div styleName="container">
        <div styleName="item">
          <Select
            activeItem={{ id: '1', label: 'BTC' }}
            items={[
              { id: '1', label: 'BTC' },
              { id: '2', label: 'ETH' },
              { id: '3', label: 'STQ' },
              { id: '4', label: 'ADA' },
              { id: '5', label: 'NEM' },
              { id: '6', label: 'NEO' },
              { id: '7', label: 'NEM' },
              { id: '8', label: 'WAX' },
              { id: '9', label: 'PPT' },
              { id: '10', label: 'SUB' },
              { id: '11', label: 'STRAT' },
              { id: '12', label: 'WTC' },
              { id: '13', label: 'EOS' },
              { id: '14', label: 'LTC' },
              { id: '15', label: 'LSK' },
              { id: '16', label: 'NXT' },
            ]}
            onSelect={this.handleSelect}
            dataTest="headerСurrenciesSelect"
          />
        </div>
        <div styleName="item">
          <Select
            activeItem={{ id: '1', label: 'ENG' }}
            items={[
              { id: '1', label: 'ENG' },
              { id: '2', label: 'CHN' },
              { id: '3', label: 'RUS' },
            ]}
            onSelect={() => {}}
            dataTest="headerLanguagesSelect"
          />
        </div>
        <div>
          <a href="_">Help</a> {/* eslint-disable-line */}
        </div>
        <div>
          <a href="/manage/wizard">Sell on Storiqa</a>
        </div>
      </div>
    );
  }
}

export default HeaderTop;
