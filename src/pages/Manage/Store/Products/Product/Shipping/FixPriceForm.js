// @flow strict

import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { head, assoc, isEmpty, find, propEq } from 'ramda';

import type { SelectItemType } from 'types';
import { InputPrice, Select, Button } from 'components/common';
import Countries from './Countries';
import ShippingInterSelect from './ShippingInterSelect';
import {
  convertCountriesToArrCodes,
  convertCountriesToStringLabels,
} from './utils';

import type {
  ServiceType,
  CompanyType,
  ShippingCountriesType,
  FilledCompanyType,
} from './types';

import './FixPriceForm.scss';

type StateType = {
  price: number,
  currency: SelectItemType,
  service: ?ServiceType,
  countries: ?ShippingCountriesType,
};

type PropsType = {
  currency: SelectItemType,
  services: Array<ServiceType>,
  onSaveCompany: (company: CompanyType) => void,
  company?: FilledCompanyType,
  inter?: boolean,
  onRemoveEditableItem?: () => void,
};

class FixPriceForm extends PureComponent<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    const { currency, company, services } = props;
    let service = null;
    if (company) {
      service = find(propEq('id', company.service && company.service.id))(
        services,
      );
    } else {
      service = !isEmpty(services) ? head(services) : null;
    }
    const countries = (service && service.countries) || null;
    this.state = {
      price: (company && company.price) || 0,
      currency,
      service,
      countries,
    };
  }

  componentDidUpdate(prevProps: PropsType, prevState: StateType) {
    const { services } = this.props;
    if (JSON.stringify(prevProps.services) !== JSON.stringify(services)) {
      const newService = find(
        propEq('id', prevState.service ? prevState.service.id : null),
      )(services);
      // if (newService) {
      //   this.updateState({ service: newService });
      //   return;
      // }
      const service = !isEmpty(services) ? head(services) : null;
      this.updateState({ service });
    }
  }

  updateState = (newState: { service: ?ServiceType }) => {
    this.setState(newState);
  };

  handleSaveCompany = () => {
    const { company, currency: defaultCurrency, onSaveCompany } = this.props;
    const { service, price, currency, countries } = this.state;
    let newCompany: CompanyType = {
      service,
      price,
      currency,
    };
    if (countries) {
      newCompany = assoc('countries', countries, newCompany);
    }
    if (company) {
      newCompany = assoc('id', company.id, newCompany);
    } else {
      this.setState({ price: 0, currency: defaultCurrency });
    }
    onSaveCompany(newCompany);
  };

  handleOnSelectService = (service: ?ServiceType) => {
    console.log('---service', service);
    this.setState({ service });
  };

  handlePriceChange = (price: number) => {
    this.setState({ price });
  };

  handleOnChangeCountries = (countries: ?ShippingCountriesType) => {
    const isCountries = !isEmpty(convertCountriesToArrCodes({ countries }));
    this.setState({ countries: isCountries ? countries : null });
  };

  render() {
    const { services, company, onRemoveEditableItem, inter } = this.props;
    const { price, currency, service, countries } = this.state;
    let isInterCompanyDisabled = true;
    let isLocalCompanyDisabled = true;
    if (company && company.service && service) {
      const companyServiceId = company.service.id;
      isInterCompanyDisabled =
        (convertCountriesToStringLabels(company.countries) ===
          convertCountriesToStringLabels(countries) &&
          companyServiceId === service.id &&
          company.price === price) ||
        isEmpty(convertCountriesToStringLabels(countries));
      isLocalCompanyDisabled =
        company && companyServiceId === service.id && company.price === price;
    }

    const withCompanySaveButtonDisabled = inter === true
      ? isInterCompanyDisabled
      : isLocalCompanyDisabled;
    return (
      <div styleName="container">
        <div styleName="selects">
          <div styleName="serviceSelect">
            {inter === true
              ? <ShippingInterSelect
                  services={services}
                  service={service}
                  handleOnSelectService={this.handleOnSelectService}
                />
              : <Select
                  forForm
                  fullWidth
                  label="Service"
                  items={services}
                  activeItem={service}
                  onSelect={this.handleOnSelectService}
                  dataTest="shippingLocalServiceSelect"
                />
            }
          </div>
          <div styleName="inputPrice">
            <InputPrice
              onChangePrice={this.handlePriceChange}
              price={price}
              currency={currency}
              dataTest={`shipping${inter === true ? 'Inter' : 'Local'}ServicePrice`}
            />
          </div>
        </div>
        {inter === true && (
          <div styleName={classNames('countries')}>
            <Countries
              countries={(service && service.countries) || null}
              onChange={this.handleOnChangeCountries}
              company={company}
            />
          </div>
        )}
        <div styleName="buttons">
          <Button
            wireframe={!company}
            big
            add={!company}
            onClick={this.handleSaveCompany}
            disabled={
              company ? withCompanySaveButtonDisabled : inter === true && !countries
            }
            dataTest={`shipping${company ? 'Save' : 'Add'}CompanyButton`}
          >
            {company ? 'Save' : 'Add company'}
          </Button>
          {company && (
            <button
              styleName="cancelButton"
              onClick={onRemoveEditableItem}
              data-test="shippingEditFormCancel"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default FixPriceForm;
