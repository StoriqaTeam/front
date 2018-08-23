// @flow

import React, { PureComponent } from 'react';

import { head, prepend, find, propEq } from 'ramda';

import { Select } from 'components/common/Select';
import { InputPrice } from 'components/common';
import { Button } from 'components/common/Button';

import { convertCurrenciesForSelect } from 'utils';

import type { SelectType } from 'components/common/Select';

import './FixPriceForm.scss';

const currenciesFromBack = [
  { key: 1, name: 'rouble', alias: 'RUB' },
  { key: 2, name: 'euro', alias: 'EUR' },
  { key: 3, name: 'dollar', alias: 'USD' },
  { key: 4, name: 'bitcoin', alias: 'BTC' },
  { key: 5, name: 'etherium', alias: 'ETH' },
  { key: 6, name: 'stq', alias: 'STQ' },
];

// type CurrenciesPropsType = Array<{ key: number, name: string, alias: string }>;

type CompanyType = {
  companyName: string,
  price: number,
  currencyId: number,
  currencyLabel: string,
};

type StateType = {
  price: number,
  currency: SelectType,
  currentService: SelectType,
  companies: Array<*>,
};

type PropsType = {
  onAddCompany: (company: CompanyType) => void,
  // currencies: CurrenciesPropsType,
  currencyId: number,
};

const services = [{ id: 'ups', label: 'Ups' }, { id: 'fedex', label: 'FedEx' }];

class FixPriceForm extends PureComponent<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      price: 0,
      currency: find(propEq('id', `${props.currencyId}`))(
        convertCurrenciesForSelect(currenciesFromBack),
      ),
      currentService: head(services),
      companies: [],
    };
  }

  handleAddCompany = () => {
    const { currentService, price, currency } = this.state;
    this.props.onAddCompany({
      companyName: currentService.label,
      price,
      currencyId: Number(currency.id),
      currencyLabel: currency.label,
    });
  };

  handleOnSelectService = (service: SelectType) => {
    this.setState({ currentService: service });
  };

  handlePriceChange = (price: number) => {
    this.setState({ price });
  };

  handleOnChangeCurrency = (currency: SelectType) => {
    this.setState({ currency });
  };

  render() {
    const { price, currency, currentService, companies } = this.state;

    console.log('---price, currency, companies', price, currency, companies);
    return (
      <div styleName="container">
        <div styleName="selects">
          <div styleName="serviceSelect">
            <Select
              forForm
              fullWidth
              label="Service"
              items={services}
              activeItem={currentService}
              onSelect={this.handleOnSelectService}
            />
          </div>
          <div styleName="inputPrice">
            <InputPrice
              onChangePrice={this.handlePriceChange}
              onChangeCurrency={this.handleOnChangeCurrency}
              price={price}
              currency={currency}
            />
          </div>
        </div>
        <div styleName="addButton">
          <Button wireframe big add onClick={this.handleAddCompany}>
            Add company
          </Button>
        </div>
      </div>
    );
  }
}

export default FixPriceForm;
