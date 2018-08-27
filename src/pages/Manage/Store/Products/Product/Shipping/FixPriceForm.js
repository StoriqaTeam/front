// @flow

import React, { PureComponent } from 'react';

import { head, find, propEq, assoc } from 'ramda';

import { InputPrice, Select, Button } from 'components/common';

import { convertCurrenciesForSelect, findCurrencyById } from 'utils';

import type { SelectType } from 'types';
import type { CompanyType } from './types';

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

type StateType = {
  price: number,
  currency: ?SelectType,
  service: SelectType,
  companies: Array<*>,
  country: ?SelectType,
};

type PropsType = {
  onSaveCompany: (company: CompanyType) => void,
  onRemoveEditableItem?: () => void,
  // currencies: CurrenciesPropsType,
  productCurrency: ?SelectType,
  services: Array<SelectType>,
  company?: {
    id?: string,
    price: number,
    currency: SelectType,
    service: SelectType,
  },
  inter?: boolean,
  countries?: Array<SelectType>,
  country?: SelectType,
};

class FixPriceForm extends PureComponent<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    const { productCurrency, company, country } = props;
    console.log('---productCurrency', productCurrency);
    this.state = {
      price: company ? company.price : 0,
      currency: productCurrency,
      service: company ? company.service : head(props.services),
      companies: [],
      country: country || null,
    };
  }

  componentDidUpdate(prevProps: PropsType) {
    const { services } = this.props;
    if (JSON.stringify(prevProps.services) !== JSON.stringify(services)) {
      this.updateCurrentService(head(services));
    }
  }

  findCurrencyById = (currencyId: number) =>
    find(propEq('id', `${currencyId}`))(
      convertCurrenciesForSelect(currenciesFromBack),
    );

  updateCurrentService = (service: SelectType) => {
    this.setState({ service });
  };

  handleSaveCompany = () => {
    const { company, productCurrency } = this.props;
    const { service, price, currency, country } = this.state;
    console.log('---currency', currency);
    let newCompany = {
      service,
      price,
      currency,
      country,
    };
    if (company) {
      newCompany = assoc('id', company.id, newCompany);
    } else {
      this.setState({ price: 0, currency: productCurrency });
    }
    this.props.onSaveCompany(newCompany);
  };

  handleOnSelectService = (service: SelectType) => {
    this.setState({ service });
  };

  handleOnSelectCountry = (country: SelectType) => {
    this.setState({ country });
  };

  handlePriceChange = (price: number) => {
    this.setState({ price });
  };

  handleOnChangeCurrency = (currency: SelectType) => {
    this.setState({ currency });
  };

  render() {
    const {
      services,
      company,
      onRemoveEditableItem,
      inter,
      countries,
    } = this.props;
    const { price, currency, service, companies, country } = this.state;
    console.log('---currency', currency);
    return (
      <div styleName="container">
        <div styleName="selects">
          <div styleName="serviceSelect">
            <Select
              forForm
              fullWidth
              label="Service"
              items={services}
              activeItem={service}
              onSelect={this.handleOnSelectService}
            />
          </div>
          {countries && (
            <div styleName="countriesSelect">
              <Select
                forForm
                fullWidth
                label="Send to"
                items={countries}
                activeItem={country}
                onSelect={this.handleOnSelectCountry}
              />
            </div>
          )}
          <div styleName="inputPrice">
            <InputPrice
              onChangePrice={this.handlePriceChange}
              onChangeCurrency={this.handleOnChangeCurrency}
              price={price}
              currency={currency}
            />
          </div>
        </div>
        <div styleName="buttons">
          <Button
            wireframe={!company}
            big
            add={!company}
            onClick={this.handleSaveCompany}
          >
            {company ? 'Save' : 'Add company'}
          </Button>
          {company && (
            <button styleName="cancelButton" onClick={onRemoveEditableItem}>
              Cancel
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default FixPriceForm;
