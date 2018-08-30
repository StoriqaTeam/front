// @flow

import React, { PureComponent } from 'react';

import { head, find, propEq, assoc, prepend, length } from 'ramda';

import { InputPrice, Select, Button } from 'components/common';

// import { convertCurrenciesForSelect, findCurrencyById } from 'utils';

import type { SelectType } from 'types';
import type { CompanyType } from './types';

import './FixPriceForm.scss';

// type CurrenciesPropsType = Array<{ key: number, name: string, alias: string }>;

type StateType = {
  price: number,
  currency: ?SelectType,
  service: SelectType,
  countries?: any,
  country?: ?SelectType,
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
  redistributeCountries: (item: SelectType) => void,
  servicesWithCountries: any,
};

class FixPriceForm extends PureComponent<PropsType, StateType> {
  static getDerivedStateFromProps(nextProps: PropsType, prevState: StateType) {
    console.log('---prevState', prevState);
    console.log('---nextProps', nextProps);
    const { servicesWithCountries } = nextProps;
    if (servicesWithCountries) {
      const { countries, service } = prevState;
      const serviceWithCountries = find(propEq('id', service.id))(
        servicesWithCountries,
      );
      if (
        serviceWithCountries &&
        JSON.stringify(length(serviceWithCountries.countries)) !==
          JSON.stringify(length(countries))
      ) {
        return {
          ...prevState,
          countries: serviceWithCountries.countries,
          country: head(serviceWithCountries.countries),
        };
      }
    }
    return null;
  }

  constructor(props: PropsType) {
    super(props);
    const { productCurrency, company, servicesWithCountries } = props;
    console.log('---servicesWithCountries', servicesWithCountries);
    const service = company ? company.service : head(props.services);

    let stateData = {
      price: company ? company.price : 0,
      currency: productCurrency,
      service,
    };
    if (servicesWithCountries) {
      const serviceWithCountries = find(propEq('id', service.id))(
        servicesWithCountries,
      );
      const { countries } = serviceWithCountries;
      const country = head(countries);
      stateData = {
        ...stateData,
        countries,
        country,
      };
    }
    this.state = stateData;
  }

  componentDidUpdate(prevProps: PropsType) {
    const { services } = this.props;
    if (JSON.stringify(prevProps.services) !== JSON.stringify(services)) {
      this.updateCurrentService(head(services));
    }
  }

  // getCountriesData = (services, ) => {
  //
  // };

  updateCurrentService = (service: SelectType) => {
    const { servicesWithCountries } = this.props;
    let stateData = {
      service,
      countries: [],
      country: null,
    };
    if (service && servicesWithCountries) {
      const serviceWithCountries = find(propEq('id', service.id))(
        servicesWithCountries,
      );
      const { countries } = serviceWithCountries;
      const country = head(countries);
      stateData = {
        ...stateData,
        countries,
        country,
      };
    }
    this.setState(stateData);
  };

  handleSaveCompany = () => {
    const { company, productCurrency } = this.props;
    const { service, price, currency, country } = this.state;
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
    this.setState({ service, country: head(service) }, () => {
      this.props.redistributeCountries(service);
    });
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
    const { services, company, onRemoveEditableItem, inter } = this.props;
    const {
      price,
      currency,
      service,
      companies,
      country,
      countries,
    } = this.state;
    console.log('---service', service);
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
          {countries &&
            inter && (
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
