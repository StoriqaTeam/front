// @flow

import React, { PureComponent } from 'react';

import {
  head,
  prepend,
  find,
  propEq,
  isEmpty,
  ifElse,
  assoc,
  length,
} from 'ramda';

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
  service: SelectType,
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
  onSaveCompany: (company: CompanyType) => void,
  onRemoveEditableItem?: () => void,
  // currencies: CurrenciesPropsType,
  currencyId: number,
  services: Array<SelectType>,
  company?: {
    id: string,
    price: number,
    currencyId: number,
    service: SelectType,
  },
};

class FixPriceForm extends PureComponent<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    const { currencyId, company } = props;
    this.state = {
      price: company ? company.price : 0,
      currency: this.findCurrencyById(
        company ? company.currencyId : currencyId,
      ),
      currentService: company ? company.service : head(props.services),
      companies: [],
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

  updateCurrentService = (currentService: SelectType) => {
    this.setState({ currentService });
  };

  handleSaveCompany = () => {
    const { company, currencyId } = this.props;
    const { currentService, price, currency } = this.state;
    let newCompany = {
      service: currentService,
      price,
      currencyId: Number(currency.id),
      currencyLabel: currency.label,
    };
    if (company) {
      newCompany = assoc('id', company.id, newCompany);
    } else {
      this.setState({ price: 0, currency: this.findCurrencyById(currencyId) });
    }
    this.props.onSaveCompany(newCompany);
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
    const { services, company, onRemoveEditableItem } = this.props;
    const { price, currency, currentService, companies } = this.state;
    // console.log('---price, currency, companies', price, currency, companies);
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
