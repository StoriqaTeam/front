// @flow

import React, { PureComponent } from 'react';

import { head, assoc, isEmpty, pathOr } from 'ramda';

import { InputPrice, Select, Button } from 'components/common';

import type { SelectItemType } from 'types';
import type { ServiceType, CompanyType, ServicesType } from './types';

import './FixPriceForm.scss';

type StateType = {
  price: number,
  currency: SelectItemType,
  service: ?ServiceType,
  country?: ?SelectItemType,
};

type PropsType = {
  currency: SelectItemType,
  services: ServicesType,
  company?: {
    id?: string,
    price: number,
    currency: SelectItemType,
    service: SelectItemType | (SelectItemType & { country: SelectItemType }),
    country?: SelectItemType,
  },
  inter?: boolean,
  onSaveCompany: (company: CompanyType) => void,
  onRemoveEditableItem?: () => void,
};

class FixPriceForm extends PureComponent<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    const { currency, company, services } = props;
    const service = !isEmpty(services) ? head(services) : null;
    const countries = (service && service.countries) || [];
    const country = countries && !isEmpty(countries) ? head(countries) : null;
    this.state = {
      price: company ? company.price : 0,
      currency,
      service,
      country,
    };
  }

  componentDidUpdate(prevProps: PropsType, prevState: StateType) {
    const { services } = this.props;
    if (JSON.stringify(prevProps.services) !== JSON.stringify(services)) {
      const service = !isEmpty(services) ? head(services) : null;
      const countries = (service && service.countries) || [];
      const country = countries && !isEmpty(countries) ? head(countries) : null;
      this.updateState({ country, service });
    }
    if (
      JSON.stringify(prevState.service) !== JSON.stringify(this.state.service)
    ) {
      // $FlowIgnore
      const countries = pathOr([], ['service', 'countries'], this.state);
      const country = countries && !isEmpty(countries) ? head(countries) : null;
      this.updateState({ country });
    }
  }

  updateState = (newState: {
    country: ?SelectItemType,
    service?: ?ServiceType,
  }) => {
    this.setState(newState);
  };

  handleSaveCompany = () => {
    const { company, currency: defaultCurrency } = this.props;
    const { service, price, currency, country } = this.state;
    let newCompany = {
      service,
      price,
      currency,
    };
    if (country) {
      newCompany = assoc('country', country, newCompany);
    }
    if (company) {
      newCompany = assoc('id', company.id, newCompany);
    } else {
      this.setState({ price: 0, currency: defaultCurrency });
    }
    // $FlowIgnore
    this.props.onSaveCompany(newCompany);
  };

  handleOnSelectService = (service: ?ServiceType) => {
    this.setState({ service });
  };

  handleOnSelectCountry = (country: SelectItemType) => {
    this.setState({ country });
  };

  handlePriceChange = (price: number) => {
    this.setState({ price });
  };

  handleOnChangeCurrency = (currency: SelectItemType) => {
    this.setState({ currency });
  };

  render() {
    const { services, company, onRemoveEditableItem, inter } = this.props;
    const { price, currency, service, country } = this.state;
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
          {inter && (
            <div styleName="countriesSelect">
              <Select
                forForm
                fullWidth
                label="Send to"
                items={service && service.countries ? service.countries : []}
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
