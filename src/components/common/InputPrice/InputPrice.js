// @flow

import React, { Component } from 'react';
import classNames from 'classnames';

import { AppContext } from 'components/App';
import { Input } from 'components/common/Input';

import type { SelectItemType } from 'types';

import CurrencySelect from './CurrencySelect';

import './InputPrice.scss';

type StateType = {
  price: string,
};

type PropsType = {
  inputRef?: (node: any) => void,
  onChangePrice: (value: number) => void,
  onFocus?: () => void,
  onBlur?: () => void,
  currency: SelectItemType,
  onChangeCurrency?: (item: SelectItemType) => void,
  price: number,
  label?: string,
  align?: 'center' | 'left' | 'right',
};

class InputPrice extends Component<PropsType, StateType> {
  static getDerivedStateFromProps(nextProps: PropsType, prevState: StateType) {
    const price = `${nextProps.price}`;
    if (Number(price) !== Number(prevState.price)) {
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
            .replace(/^0([0-9])/, '$1')
            .replace(/,/, '.') || '0',
      });
      onChangePrice(
        Number(
          value
            .replace(/[.,]$/, '')
            .replace(/^0([0-9])/, '$1')
            .replace(/(^0\.[0-9])0+$/, '$1'),
        ),
      );
      return;
    }
    if (value === '') {
      this.setState({ price: '0' });
      onChangePrice(0);
    }
  };

  handlePriceFocus = () => {
    const { onFocus } = this.props;
    if (onFocus) {
      onFocus();
    }
  };

  handlePriceBlur = () => {
    const value = `${this.state.price}`;
    if (Number(value) === 0) {
      this.setState({
        price: '0',
      });
    } else {
      this.setState({
        price: value
          .replace(/\.$/, '')
          .replace(/^0([0-9])/, '$1')
          .replace(/\.0+$/, '')
          .replace(/(^0\.[0-9])0+$/, '$1'),
      });
    }
    const { onBlur } = this.props;
    if (onBlur) {
      onBlur();
    }
  };

  render() {
    const { currency, onChangeCurrency, label, align, inputRef } = this.props;
    const { price } = this.state;
    return (
      <AppContext.Consumer>
        {({ directories }) => (
          <div styleName="container">
            <div styleName="input">
              <Input
                inputRef={inputRef}
                fullWidth
                label={label}
                onChange={this.handlePriceChange}
                onFocus={this.handlePriceFocus}
                onBlur={this.handlePriceBlur}
                value={price}
                align={align}
              />
            </div>
            {currency && (
              <div
                styleName={classNames('select', {
                  fixCurrencySelect: !onChangeCurrency,
                })}
              >
                {onChangeCurrency ? (
                  <CurrencySelect
                    currency={currency}
                    onChangeCurrency={onChangeCurrency}
                    currencies={directories.currencies}
                  />
                ) : (
                  <div styleName="fixCurrency">{currency.label}</div>
                )}
              </div>
            )}
          </div>
        )}
      </AppContext.Consumer>
    );
  }
}

export default InputPrice;
