// @flow

import React, { Component } from 'react';
import { map } from 'ramda';

import { Select } from 'components/common/Select';

import type { SelectItemType } from 'types';

type StateType = {
  currency: SelectItemType,
};

type PropsType = {
  currencies: Array<string>,
  currency: SelectItemType,
  onChangeCurrency: (item: ?SelectItemType) => void,
  dataTest: string,
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
    this.state = {
      currency: props.currency,
    };
  }

  handleOnChange = (item: SelectItemType) => {
    this.setState({ currency: item });
    this.props.onChangeCurrency(item);
  };

  render() {
    const { dataTest } = this.props;
    const { currency } = this.state;
    const currencies = map(
      item => ({ id: item, label: item }),
      this.props.currencies,
    );
    return (
      <Select
        forForm
        fullWidth
        label="Currency"
        items={currencies}
        activeItem={currency}
        onSelect={this.handleOnChange}
        dataTest={dataTest}
      />
    );
  }
}

export default CurrencySelect;
