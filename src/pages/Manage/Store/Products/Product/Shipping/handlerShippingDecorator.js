// @flow

import React, { Component } from 'react';
import type { Node } from 'react';
import {
  prepend,
  map,
  difference,
  filter,
  isEmpty,
  forEach,
  contains,
  head,
  addIndex,
} from 'ramda';

import type { SelectItemType } from 'types';

import {
  convertLocalAvailablePackages,
  getServiceLogo,
  convertInterAvailablePackages,
  convertCountriesToArrCodes,
  getServiceRawId,
  getService,
  convertCountriesForSelect,
  getCountries,
} from './utils';

import type {
  CompanyType,
  FilledCompanyType,
  InterServiceType,
  ShippingChangeDataType,
  ServiceType,
  ShippingType,
  AvailablePackageType,
} from './types';

type PropsType = {
  children: Node,
  currency: SelectItemType,
  localShipping: Array<ShippingType>,
  interShipping: Array<ShippingType>,
  localAvailablePackages: Array<AvailablePackageType>,
  interAvailablePackages: Array<AvailablePackageType>,
  onChangeShippingData: (data: ShippingChangeDataType) => void,
};

type StateType = {
  companies: Array<FilledCompanyType>,
  editableItemId: ?string,
  remainingServices: Array<ServiceType>,
  possibleServices?: Array<ServiceType>,
};

export default (OriginalComponent: any, inter?: boolean) =>
  class HandlerShippingDecorator extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
      super(props);
      const { interShipping, localShipping, onChangeShippingData } = props;
      const companies = addIndex(map)(
        (item, idx) => this.makeCompany(item, idx),
        inter ? interShipping : localShipping,
      );
      onChangeShippingData({ companies, inter });

      const remainingServices = inter
        ? this.setRemainingServicesInter(companies)
        : this.setRemainingServicesLocal(companies);

      this.state = {
        companies,
        editableItemId: null,
        remainingServices,
      };
    }

    setRemainingServicesLocal = (
      companies: Array<FilledCompanyType>,
    ): Array<ServiceType> =>
      difference(
        convertLocalAvailablePackages(this.props.localAvailablePackages),
        // $FlowIgnore
        map(item => item.service, companies),
      );

    setRemainingServicesInter = (
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
      if (company.id) {
        this.setState(
          (prevState: StateType) => {
            const { service } = company;
            const newCompany = {
              ...company,
              companyPackageRawId: getServiceRawId({
                id: company.service && company.service.id,
                packages: inter
                  ? this.props.interAvailablePackages
                  : this.props.localAvailablePackages,
              }),
              logo: getServiceLogo({
                id: company.service && company.service.id,
                packages: inter
                  ? this.props.interAvailablePackages
                  : this.props.localAvailablePackages,
              }),
              service: service
                ? { id: service.id, label: service.label }
                : null,
            };
            const newCompanies = map(
              item => (item.id === company.id ? newCompany : item),
              prevState.companies,
            );
            const remainingServices = inter
              ? this.setRemainingServicesInter(newCompanies)
              : this.setRemainingServicesLocal(newCompanies);
            return {
              companies: newCompanies,
              remainingServices,
              editableItemId: null,
            };
          },
          () => {
            this.props.onChangeShippingData({
              companies: this.state.companies,
              inter,
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
                packages: inter
                  ? this.props.interAvailablePackages
                  : this.props.localAvailablePackages,
              }),
              logo: getServiceLogo({
                id: company.service && company.service.id,
                packages: inter
                  ? this.props.interAvailablePackages
                  : this.props.localAvailablePackages,
              }),
              service: service
                ? { id: service.id, label: service.label }
                : null,
            };
            const newCompanies = prepend(newCompany, prevState.companies);
            const remainingServices = inter
              ? this.setRemainingServicesInter(newCompanies)
              : this.setRemainingServicesLocal(newCompanies);
            return {
              companies: newCompanies,
              remainingServices,
              editableItemId: null,
            };
          },
          () => {
            this.props.onChangeShippingData({
              companies: this.state.companies,
              inter,
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
          const remainingServices = inter
            ? this.setRemainingServicesInter(newCompanies)
            : this.setRemainingServicesLocal(newCompanies);
          return {
            companies: newCompanies,
            remainingServices,
            editableItemId: null,
          };
        },
        () => {
          this.props.onChangeShippingData({
            companies: this.state.companies,
            inter,
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
        let possibleServices = [];
        if (inter && company.countries) {
          possibleServices = this.setRemainingServicesInter(newCompanies);
        } else {
          possibleServices = this.setRemainingServicesLocal(newCompanies);
        }
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
      const {
        interAvailablePackages,
        localAvailablePackages,
        currency,
      } = this.props;
      const service = getService({
        id: data.companyPackageId,
        packages: inter ? interAvailablePackages : localAvailablePackages,
      });

      let company = {
        id: `${Date.now()}-${idx}`,
        companyPackageRawId: getServiceRawId({
          id: service && service.id,
          packages: inter ? interAvailablePackages : localAvailablePackages,
        }),
        currency,
        price: data.price,
        logo: getServiceLogo({
          id: service && service.id,
          packages: inter ? interAvailablePackages : localAvailablePackages,
        }),
        service,
      };

      if (inter) {
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
      }

      return company;
    };

    render() {
      return (
        <OriginalComponent
          {...this.props}
          {...this.state}
          inter={inter}
          onSaveCompany={this.handleOnSaveCompany}
          onRemoveCompany={this.handleOnRemoveCompany}
          onSetEditableItem={this.handleOnSetEditableItem}
          onRemoveEditableItem={this.handleOnRemoveEditableItem}
        >
          {this.props.children}
        </OriginalComponent>
      );
    }
  };
