// @flow strict

import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { head, assoc, isEmpty, find, propEq } from 'ramda';

import { InputPrice, Button } from 'components/common';

import type { SelectItemType } from 'types';

import Countries from '../Countries';
import ShippingLocalSelect from '../ShippingLocalSelect';
import ShippingInterSelect from '../ShippingInterSelect';
import {
  convertCountriesToArrCodes,
  convertCountriesToStringLabels,
} from '../utils';

import type {
  ServiceType,
  CompanyType,
  ShippingCountriesType,
  FilledCompanyType,
} from '../types';

import './FixPriceForm.scss';

import t from './i18n';

type StateType = {
  price: number,
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
    const { company, services } = props;
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
      if (newService) {
        this.updateState({ service: newService });
        return;
      }
      const service = !isEmpty(services) ? head(services) : null;
      this.updateState({ service });
    }
  }

  updateState = (newState: { service: ?ServiceType }) => {
    this.setState(newState);
  };

  handleSaveCompany = () => {
    const { company, onSaveCompany } = this.props;
    const { service, price, countries } = this.state;
    let newCompany: CompanyType = {
      service,
      price,
    };
    if (countries) {
      newCompany = assoc('countries', countries, newCompany);
    }
    if (company) {
      newCompany = assoc('id', company.id, newCompany);
    } else {
      this.setState({ price: 0 });
    }
    onSaveCompany(newCompany);
  };

  handleOnSelectLocalService = (service: ?ServiceType) => {
    this.setState({ service: { ...service } });
  };

  handleOnSelectInterService = (service: ?ServiceType) => {
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
    const {
      services,
      company,
      onRemoveEditableItem,
      inter,
      currency,
    } = this.props;
    const { price, service, countries } = this.state;
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

    const withCompanySaveButtonDisabled =
      inter === true ? isInterCompanyDisabled : isLocalCompanyDisabled;
    return (
      <div styleName="container">
        <div styleName="selects">
          <div styleName="serviceSelect">
            {inter === true ? (
              <ShippingInterSelect
                services={services}
                service={service}
                handleOnSelectService={this.handleOnSelectInterService}
              />
            ) : (
              <ShippingLocalSelect
                services={services}
                service={service}
                handleOnSelectService={this.handleOnSelectLocalService}
              />
            )}
          </div>
          <div styleName="inputPrice">
            <InputPrice
              onChangePrice={this.handlePriceChange}
              price={price}
              currency={currency}
              dataTest={`shipping${
                inter === true ? 'Inter' : 'Local'
              }ServicePrice`}
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
              company
                ? withCompanySaveButtonDisabled
                : inter === true && !countries
            }
            dataTest={`shipping${company ? 'Save' : 'Add'}CompanyButton_${
              inter === true ? 'inter' : 'local'
            }`}
          >
            {company ? t.save : t.addCompany}
          </Button>
          {company && (
            <button
              styleName="cancelButton"
              onClick={onRemoveEditableItem}
              data-test="shippingEditFormCancel"
            >
              {t.cancel}
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default FixPriceForm;
