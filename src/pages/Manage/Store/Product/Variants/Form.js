// @flow

import React, { Component } from 'react';

import { Button } from 'components/Button';
import { Checkbox } from 'components/Forms';
import { log } from 'utils';

import Characteristics from './Characteristics';

import './Form.scss';

type PropsType = {
  id: string,
  vendorCode?: string,
  price?: number,
  cashback?: number,
  characteristics?: Array<{}>,
  onSave: Function,
  categoryId: number,
};

type StateType = {
  vendorCode: string,
  price: number,
  cashback: number,
};

class Form extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      vendorCode: props.vendorCode,
      price: props.price,
      cashback: props.cashback,
    };
  }

  state: StateType = {
    //
  };

  handleSave = () => {
    const {
      vendorCode,
      price,
      cashback,
    } = this.state;
    this.props.onSave({
      vendorCode,
      price,
      cashback,
    });
  };

  handleCheckboxClick = () => this.setState(prevState => ({ checked: !prevState.checked }));

  handleVendorCodeChange = (e: any) => {
    this.setState({ vendorCode: e.target.value });
  };

  handlePriceChange = (e: any) => {
    const { target: { value } } = e;
    if (value === '') {
      this.setState({ price: null });
      return;
    } else if (Number.isNaN(parseFloat(value))) {
      return;
    }
    this.setState({ price: parseFloat(value) });
  };

  handleCashbackChange = (e: any) => {
    const { target: { value } } = e;
    if (value === '') {
      this.setState({ cashback: null });
      return;
    } else if (Number.isNaN(parseFloat(value))) {
      return;
    }
    this.setState({ cashback: parseFloat(value) });
  };

  render() {
    const {
      id,
    } = this.props;

    const {
      vendorCode,
      price,
      cashback,
    } = this.state;
    return (
      <div>
        <div styleName="formHeader">
          <Checkbox
            id={`variants-row-checkbox-${id}`}
            onChange={this.handleCheckboxClick}
          />
          <div styleName="inputComponent">
            <input
              styleName="input vendorCodeInput"
              type="text"
              onChange={this.handleVendorCodeChange}
              value={vendorCode || ''}
            />
          </div>
          <div styleName="inputComponent">
            <input
              styleName="input priceInput"
              type="text"
              onChange={this.handlePriceChange}
              value={price || ''}
            />
            <span styleName="inputPostfix">STQ</span>
          </div>
          <div styleName="inputComponent">
            <input
              styleName="input cashbackInput"
              type="text"
              onChange={this.handleCashbackChange}
              value={cashback || ''}
            />
            <span styleName="inputPostfix">%</span>
          </div>
        </div>
        <Characteristics
          onChange={values => log.debug('Form', { values })}
        />
        <Button
          type="button"
          onClick={this.handleSave}
        >
          Save
        </Button>
      </div>
    );
  }
}

export default Form;
