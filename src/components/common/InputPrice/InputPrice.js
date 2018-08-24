// @flow

import React, { Component } from 'react';

import { AppContext } from 'components/App';
import { Input } from 'components/common';

import type { SelectType } from 'components/common/Select';

import CurrencySelect from './CurrencySelect';

import './InputPrice.scss';
import { head, length } from 'ramda';

type StateType = {
  price: string,
};

type PropsType = {
  onChangePrice: (value: number) => void,
  currency: SelectType,
  onChangeCurrency: (item: SelectType) => void,
  price: number,
};

class InputPrice extends Component<PropsType, StateType> {
  static getDerivedStateFromProps(nextProps: PropsType, prevState: StateType) {
    const price = `${nextProps.price}`;
    if (price !== prevState.price) {
      return { ...prevState, price };
    }
    return null;
  }

  constructor(props: PropsType) {
    super(props);
    this.state = {
      price: props.price ? `${props.price}` : '0',
    };
  }

  handlePriceChange = (e: any) => {
    const {
      target: { value },
    } = e;
    const { onChangePrice } = this.props;
    const regexp = /(^[0-9]*[.,]?[0-9]*$)/;
    if (regexp.test(value)) {
      this.setState({
        price:
          value
            .replace(/^0+/, '0')
            .replace(/^[.,]/, '0.')
            .replace(/^0([1-9])/, '$1')
            .replace(/,/, '.') || '0',
      });
      onChangePrice(Number(value.replace(/[.,]$/, '')));
      return;
    }
    if (value === '') {
      this.setState({ price: '0' });
      onChangePrice(0);
    }
  };

  handlePriceBlur = () => {
    const value = `${this.state.price}`;
    if (Number(value) === 0) {
      this.setState({
        price: '0',
      });
      return;
    }
    this.setState({
      price: value.replace(/\.$/, ''),
    });
  };

  render() {
    const { currency, onChangeCurrency } = this.props;
    const { price } = this.state;
    return (
      <AppContext.Consumer>
        {({ directories }) => (
          <div styleName="container">
            <div styleName="input">
              <Input
                fullWidth
                label="Price"
                onChange={this.handlePriceChange}
                onBlur={this.handlePriceBlur}
                value={price}
              />
            </div>
            <div styleName="select">
              <CurrencySelect
                currency={currency}
                onChangeCurrency={onChangeCurrency}
                currencies={directories.currencies}
              />
            </div>
          </div>
        )}
      </AppContext.Consumer>
    );
  }
}

export default InputPrice;
