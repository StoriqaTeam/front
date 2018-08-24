// @flow

import React, { Component } from 'react';
import { map, filter, find, propEq } from 'ramda';

import { Select } from 'components/common';

import type { SelectType } from 'components/common/Select';

// import './CurrencySelect.scss';

const currenciesFromBack = [
  { key: 1, name: 'rouble', alias: 'RUB' },
  { key: 2, name: 'euro', alias: 'EUR' },
  { key: 3, name: 'dollar', alias: 'USD' },
  { key: 4, name: 'bitcoin', alias: 'BTC' },
  { key: 5, name: 'etherium', alias: 'ETH' },
  { key: 6, name: 'stq', alias: 'STQ' },
];

// type CurrenciesPropsType = Array<{ key: number, name: string, alias: string }>;

type StateType = {
  currencies: Array<SelectType>,
  currency: SelectType,
};

type PropsType = {
  // currencies: CurrenciesPropsType,
  currency: SelectType,
  onChangeCurrency: (item: SelectType) => void,
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

  handleOnChange = (item: SelectType) => {
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
