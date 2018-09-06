// @flow

import React, { Component } from 'react';
import { map, filter } from 'ramda';

import { Select } from 'components/common/Select';

import type { SelectItemType } from 'types';

const currenciesFromBack = [
  { key: 1, name: 'rouble', alias: 'RUB' },
  { key: 2, name: 'euro', alias: 'EUR' },
  { key: 3, name: 'dollar', alias: 'USD' },
  { key: 4, name: 'bitcoin', alias: 'BTC' },
  { key: 5, name: 'etherium', alias: 'ETH' },
  { key: 6, name: 'stq', alias: 'STQ' },
];

type StateType = {
  currencies: Array<SelectItemType>,
  currency: SelectItemType,
};

type PropsType = {
  currency: SelectItemType,
  onChangeCurrency: (item: SelectItemType) => void,
};

class CurrencySelect extends Component<PropsType, StateType> {
  static getDerivedStateFromProps(nextProps: PropsType, prevState: StateType) {
    const { currency } = nextProps;
    if (JSON.stringify(currency) !== JSON.stringify(prevState.currency)) {
      return { ...prevState, currency };
    }
    return null;
  }

  constructor(props: PropsType) {
    super(props);
    const currencies = filter(
      item =>
        item.label === 'BTC' || item.label === 'ETH' || item.label === 'STQ',
      map(
        item => ({ id: `${item.key}`, label: item.alias }),
        currenciesFromBack,
      ),
    );
    this.state = {
      currencies,
      currency: props.currency,
    };
  }

  handleOnChange = (item: SelectItemType) => {
    this.setState({ currency: item });
    this.props.onChangeCurrency(item);
  };

  render() {
    const { currencies, currency } = this.state;
    return (
      <Select
        forForm
        fullWidth
        label="Currency"
        items={currencies}
        activeItem={currency}
        onSelect={this.handleOnChange}
      />
    );
  }
}

export default CurrencySelect;
