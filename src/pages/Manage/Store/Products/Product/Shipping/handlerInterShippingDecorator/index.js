// @flow strict

import React, { Component } from 'react';
import type { Node, ComponentType } from 'react';
import {
  prepend,
  map,
  filter,
  isEmpty,
  forEach,
  contains,
  head,
  addIndex,
} from 'ramda';

import type { SelectItemType } from 'types';

import {
  getServiceLogo,
  convertInterAvailablePackages,
  convertCountriesToArrCodes,
  getServiceRawId,
  getService,
  convertCountriesForSelect,
  getCountries,
} from '../utils';

import type {
  CompanyType,
  FilledCompanyType,
  InterServiceType,
  ShippingChangeDataType,
  ServiceType,
  ShippingType,
  AvailablePackageType,
} from '../types';

type PropsType = {
  currency: SelectItemType,
  children?: Node,
  interShipping: Array<ShippingType>,
  interAvailablePackages: Array<AvailablePackageType>,
  onChangeShippingData: (data: ShippingChangeDataType) => void,
  error: ?string,
};

type StateType = {
  companies: Array<FilledCompanyType>,
  editableItemId: ?string,
  remainingServices: Array<ServiceType>,
  possibleServices?: Array<ServiceType>,
};

export default (OriginalComponent: ComponentType<*>): ComponentType<*> =>
  class HandlerShippingDecorator extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
      super(props);
      const { interShipping, onChangeShippingData } = props;
      const companies = addIndex(map)(
        (item, idx) => this.makeCompany(item, idx),
        interShipping,
      );
      const checkedCompanies = filter(
        item => item.companyPackageRawId !== -1,
        companies || [],
      );
      const shippingData = {
        companies: checkedCompanies,
        inter: true,
        withoutInter: Boolean(isEmpty(checkedCompanies)),
      };
      onChangeShippingData(shippingData);

      const remainingServices = this.setRemainingServices(checkedCompanies);

      this.state = {
        companies: checkedCompanies,
        editableItemId: null,
        remainingServices,
      };
    }

    setRemainingServices = (
      companies: Array<FilledCompanyType>,
    ): Array<InterServiceType> => {
      let defaultServices = convertInterAvailablePackages(
        this.props.interAvailablePackages,
      );
      forEach(company => {
        defaultServices = map(service => {
          if (company.service && company.service.id === service.id) {
            const { countries } = service;
            const companyCountriesArr = convertCountriesToArrCodes({
              countries: company.countries,
            });

            const newContinentsChildren = map(continent => {
              const newCountriesChildren = filter(
                country => !contains(country.alpha3, companyCountriesArr),
                continent.children,
              );
              return { ...continent, children: newCountriesChildren };
            }, countries ? countries.children : []);
            const filteredNewContinentsChildren = filter(
              item => !isEmpty(item.children),
              newContinentsChildren,
            );

            return {
              ...service,
              countries: {
                ...countries,
                children: filteredNewContinentsChildren,
              },
            };
          }
          return service;
        }, defaultServices);
      }, companies);

      const filteredDefaultServices = filter(
        item => !isEmpty(item.countries ? item.countries.children : []),
        defaultServices,
      );
      return filteredDefaultServices;
    };

    handleOnSaveCompany = (company: CompanyType) => {
      if (company.id !== undefined) {
        this.setState(
          (prevState: StateType) => {
            const { service } = company;
            const newCompany = {
              ...company,
              companyPackageRawId: getServiceRawId({
                id: company.service && company.service.id,
                packages: this.props.interAvailablePackages,
              }),
              logo: getServiceLogo({
                id: company.service && company.service.id,
                packages: this.props.interAvailablePackages,
              }),
              service: service
                ? {
                    id: service.id,
                    label: service.label,
                    currency: service.currency,
                  }
                : null,
            };
            const newCompanies = map(
              item => (item.id === company.id ? newCompany : item),
              prevState.companies,
            );
            const remainingServices = this.setRemainingServices(newCompanies);
            return {
              companies: newCompanies,
              remainingServices,
              editableItemId: null,
            };
          },
          () => {
            this.props.onChangeShippingData({
              companies: this.state.companies,
              inter: true,
            });
          },
        );
      } else {
        this.setState(
          (prevState: StateType) => {
            const { service } = company;
            const newCompany = {
              ...company,
              id: `${Date.now()}`,
              companyPackageRawId: getServiceRawId({
                id: company.service && company.service.id,
                packages: this.props.interAvailablePackages,
              }),
              logo: getServiceLogo({
                id: company.service && company.service.id,
                packages: this.props.interAvailablePackages,
              }),
              service: service
                ? {
                    id: service.id,
                    label: service.label,
                    currency: service.currency,
                  }
                : null,
            };
            const newCompanies = prepend(newCompany, prevState.companies);
            const remainingServices = this.setRemainingServices(newCompanies);
            return {
              companies: newCompanies,
              remainingServices,
              editableItemId: null,
            };
          },
          () => {
            this.props.onChangeShippingData({
              companies: this.state.companies,
              inter: true,
            });
          },
        );
      }
    };

    handleOnRemoveCompany = (company: FilledCompanyType) => {
      this.setState(
        (prevState: StateType) => {
          const newCompanies = filter(
            item => company.id !== item.id,
            prevState.companies,
          );
          const remainingServices = this.setRemainingServices(newCompanies);
          return {
            companies: newCompanies,
            remainingServices,
            editableItemId: null,
          };
        },
        () => {
          this.props.onChangeShippingData({
            companies: this.state.companies,
            inter: true,
          });
        },
      );
    };

    handleOnSetEditableItem = (company: FilledCompanyType) => {
      this.setState((prevState: StateType) => {
        const newCompanies = filter(
          item => company.id !== item.id,
          prevState.companies,
        );
        const possibleServices = this.setRemainingServices(newCompanies);
        return {
          editableItemId: company.id,
          possibleServices,
        };
      });
    };

    handleOnRemoveEditableItem = () => {
      this.setState({ editableItemId: null });
    };

    makeCompany = (data: ShippingType, idx: number): FilledCompanyType => {
      const { interAvailablePackages } = this.props;
      const service = getService({
        id: data.companyPackageId,
        packages: interAvailablePackages,
      });

      let company = {
        id: `${Date.now()}-${idx}`,
        companyPackageRawId: getServiceRawId({
          id: service && service.id,
          packages: interAvailablePackages,
        }),
        price: data.price,
        logo: getServiceLogo({
          id: service && service.id,
          packages: interAvailablePackages,
        }),
        service,
      };

      const countries = convertCountriesForSelect({
        countries: getCountries({
          id: data.companyPackageId,
          packages: interAvailablePackages,
        }),
        checkedCountries: convertCountriesToArrCodes({
          countries: data.deliveriesTo ? head(data.deliveriesTo) : null,
          isSelectedAll: true,
        }),
      });
      company = { ...company, countries };

      return company;
    };

    render() {
      const {
        error,
        interAvailablePackages,
        interShipping,
        onChangeShippingData,
        currency,
      } = this.props;
      const {
        companies,
        editableItemId,
        remainingServices,
        possibleServices,
      } = this.state;
      return (
        <OriginalComponent
          currency={currency}
          error={error}
          companies={companies}
          editableItemId={editableItemId}
          remainingServices={remainingServices}
          possibleServices={possibleServices}
          onChangeShippingData={onChangeShippingData}
          onSaveCompany={this.handleOnSaveCompany}
          onRemoveCompany={this.handleOnRemoveCompany}
          onSetEditableItem={this.handleOnSetEditableItem}
          onRemoveEditableItem={this.handleOnRemoveEditableItem}
          interAvailablePackages={interAvailablePackages}
          interShipping={interShipping}
        >
          {this.props.children}
        </OriginalComponent>
      );
    }
  };
