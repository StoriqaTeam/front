// @flow

import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { head, assoc, isEmpty, pathOr } from 'ramda';

import type { SelectItemType } from 'types';
import { InputPrice, Select, Button } from 'components/common';
import Countries from './Countries';

import type { ServiceType, CompanyType, ServicesType } from './types';

import './FixPriceForm.scss';

type StateType = {
  price: number,
  currency: SelectItemType,
  service: ?ServiceType,
  country?: ?SelectItemType,
  sendTo: SelectItemType,
  countries: any,
  // countriesForResponse: Array<string>,
};

type PropsType = {
  currency: SelectItemType,
  services: ServicesType,
  company?: {
    id?: string,
    price: number,
    currency: SelectItemType,
    service: ServiceType,
    country?: SelectItemType,
  },
  inter?: boolean,
  onSaveCompany: (company: CompanyType) => void,
  onRemoveEditableItem?: () => void,
  interAvailablePackages: any,
};

class FixPriceForm extends PureComponent<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    const { currency, company, services } = props;
    let service = null;
    if (company) {
      ({ service } = company);
    } else {
      service = !isEmpty(services) ? head(services) : null;
    }
    const countries = (service && service.countries) || [];
    const country = countries && !isEmpty(countries) ? head(countries) : null;
    // const countriesForResponse =
    //   !isEmpty(countries) ?
    //     convertCountriesForResponse(countries, true) :
    //     [];
    this.state = {
      price: company ? company.price : 0,
      currency,
      service,
      country,
      sendTo: { id: 'all', label: 'All countries' },
      countries,
      // countriesForResponse,
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
      // const countriesForResponse = !isEmpty(countries) ? convertCountriesForResponse(head(countries).children, true) : [];
      this.updateState({ country });
    }
  }

  updateState = (newState: {
    country: ?SelectItemType,
    service?: ?ServiceType,
    // countriesForResponse?: any,
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
      // $FlowIgnore
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

  handleOnSelectCountryNew = (item: SelectItemType) => {
    this.setState({ sendTo: item, countriesForResponse: [] });
  };

  handlePriceChange = (price: number) => {
    this.setState({ price });
  };

  handleOnChangeCurrency = (currency: SelectItemType) => {
    this.setState({ currency });
  };

  handleOnChangeCountries = (countries: any) => {
    // console.log('---countries', countries);
    // console.log('---this.state.countries', this.state.countries);
    this.setState({ countries });
    // this.setState({ countriesForResponse: convertCountriesForResponse(countries)});
  };

  render() {
    const { services, company, onRemoveEditableItem, inter } = this.props;
    const { price, currency, service, country, countries } = this.state;
    console.log('---countries', countries);
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
          {/* inter && (
            <div styleName="countriesSelect">
              <Select
                forForm
                fullWidth
                label="Send to"
                items={service && service.countries ? service.countries : []}
                activeItem={country}
                onSelect={this.handleOnSelectCountry}
              />
              <Select
                forForm
                fullWidth
                label="Send to"
                items={[
                  { id: 'all', label: 'All countries' },
                  { id: 'сertain', label: 'Сertain countries' },
                ]}
                activeItem={sendTo}
                onSelect={this.handleOnSelectCountryNew}
              />
            </div>
          ) */}
          <div styleName="inputPrice">
            <InputPrice
              onChangePrice={this.handlePriceChange}
              onChangeCurrency={this.handleOnChangeCurrency}
              price={price}
              currency={currency}
            />
          </div>
        </div>
        {inter && (
          <div styleName={classNames('countries')}>
            <Countries
              countries={(service && service.countries) || null}
              onChange={this.handleOnChangeCountries}
            />
          </div>
        )}
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
