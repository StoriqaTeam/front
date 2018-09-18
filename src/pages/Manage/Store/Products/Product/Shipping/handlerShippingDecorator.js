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
  dissoc,
  contains,
  head,
  assoc,
  addIndex,
} from 'ramda';

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
  ServicesType,
  ServicesInterType,
  CompanyType,
  CompaniesType,
  CompaniesInterType,
  LocalAvailablePackagesType,
  InterAvailablePackagesType,
} from './types';

type PropsType = {
  children: Array<Node>,
  localShipping: any,
  interShipping: any,
  localAvailablePackages: LocalAvailablePackagesType,
  interAvailablePackages: InterAvailablePackagesType,
  globalOnChange: () => {},
  currency: any,
};

type StateType = {
  companies: Array<CompanyType>,
  editableItemId: ?string,
  remainingServices: ServicesType | ServicesInterType,
  possibleServices?: ServicesType | ServicesInterType,
};

export default (OriginalComponent: any, inter?: boolean) =>
  class HandlerShippingDecorator extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
      super(props);

      const companies = addIndex(map)(
        (item, idx) => this.makeCompany(item, idx),
        inter ? props.interShipping : props.localShipping,
      );

      // const companies = map(item => this.makeCompany(item), inter ? props.interShipping : props.localShipping);
      console.log('---companies', companies);
      props.globalOnChange({ companies, inter });

      const remainingServices = inter
        ? // $FlowIgnore
          this.setRemainingServicesInter(companies)
        : this.setRemainingServicesLocal(companies);

      this.state = {
        companies,
        editableItemId: null,
        remainingServices,
      };
    }

    onSaveCompany = (company: CompanyType) => {
      if (company.id) {
        this.setState(
          (prevState: StateType) => {
            const newCompany = {
              ...company,
              companyPackageRawId: getServiceRawId(
                company.service.id,
                inter
                  ? this.props.interAvailablePackages
                  : this.props.localAvailablePackages,
              ),
              logo: getServiceLogo(
                company.service.id,
                inter
                  ? this.props.interAvailablePackages
                  : this.props.localAvailablePackages,
              ),
              service: dissoc('countries', company.service),
            };
            const newCompanies = map(
              item => (item.id === company.id ? newCompany : item),
              prevState.companies,
            );
            const remainingServices = inter
              ? // $FlowIgnore
                this.setRemainingServicesInter(newCompanies)
              : // $FlowIgnore
                this.setRemainingServicesLocal(newCompanies);
            return {
              companies: newCompanies,
              remainingServices,
              editableItemId: null,
            };
          },
          () => {
            this.props.globalOnChange({
              companies: this.state.companies,
              inter,
            });
          },
        );
      } else {
        this.setState(
          (prevState: StateType) => {
            const newCompany = {
              ...company,
              id: `${Date.now()}`,
              companyPackageRawId: getServiceRawId(
                company.service.id,
                inter
                  ? this.props.interAvailablePackages
                  : this.props.localAvailablePackages,
              ),
              logo: getServiceLogo(
                company.service.id,
                inter
                  ? this.props.interAvailablePackages
                  : this.props.localAvailablePackages,
              ),
              service: dissoc('countries', company.service),
            };
            // $FlowIgnore
            const newCompanies = prepend(newCompany, prevState.companies);
            const remainingServices = inter
              ? // $FlowIgnore
                this.setRemainingServicesInter(newCompanies)
              : this.setRemainingServicesLocal(newCompanies);
            return {
              companies: newCompanies,
              remainingServices,
              editableItemId: null,
            };
          },
          () => {
            this.props.globalOnChange({
              companies: this.state.companies,
              inter,
            });
          },
        );
      }
    };

    onRemoveCompany = (company: any) => {
      this.setState(
        (prevState: StateType) => {
          const newCompanies = filter(
            item => company.id !== item.id,
            prevState.companies,
          );
          const remainingServices = inter
            ? // $FlowIgnore
              this.setRemainingServicesInter(newCompanies)
            : this.setRemainingServicesLocal(newCompanies);
          return {
            companies: newCompanies,
            remainingServices,
            editableItemId: null,
          };
        },
        () => {
          this.props.globalOnChange({ companies: this.state.companies, inter });
        },
      );
    };

    onSetEditableItem = (company: any) => {
      this.setState((prevState: StateType) => {
        const newCompanies = filter(
          item => company.id !== item.id,
          prevState.companies,
        );
        let possibleServices = [];
        if (inter && company.countries) {
          const checkedCountries = convertCountriesToArrCodes(
            company.countries,
          );
          possibleServices = this.setRemainingServicesInter(
            newCompanies,
            checkedCountries,
          );
        } else {
          possibleServices = this.setRemainingServicesLocal(newCompanies);
        }
        return {
          editableItemId: company.id,
          possibleServices,
        };
      });
    };

    onRemoveEditableItem = () => {
      this.setState({ editableItemId: null });
    };

    setRemainingServicesLocal = (companies: CompaniesType) =>
      difference(
        convertLocalAvailablePackages(this.props.localAvailablePackages),
        map(item => item.service, companies),
      );

    setRemainingServicesInter = (companies: CompaniesInterType) => {
      let defaultServices = convertInterAvailablePackages(
        this.props.interAvailablePackages,
      );
      forEach(company => {
        defaultServices = map(service => {
          if (service.id === company.service.id) {
            const { countries } = service;
            // тут работаем с сервисом, с которым совпадает компания
            // это массив с выбранными странами, надо пройтись по всем странам сервиса во всех континентах и выпилить их нахрен!
            const companyCountriesArr = convertCountriesToArrCodes(
              company.countries,
            );

            const newContinentsChildren = map(continent => {
              const newCountriesChildren = filter(
                country => !contains(country.alpha3, companyCountriesArr),
                continent.children,
              );
              return { ...continent, children: newCountriesChildren };
            }, countries.children);
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
        item => !isEmpty(item.countries.children),
        defaultServices,
      );
      return filteredDefaultServices;
    };

    makeCompany = (data: any, idx: number) => {
      const {
        interAvailablePackages,
        localAvailablePackages,
        currency,
      } = this.props;
      const service = getService(
        data.companyPackageId,
        inter ? interAvailablePackages : localAvailablePackages,
      );

      let company = {
        id: `${Date.now()}-${idx}`,
        companyPackageRawId: getServiceRawId(
          service.id,
          inter ? interAvailablePackages : localAvailablePackages,
        ),
        currency,
        price: data.price,
        logo: getServiceLogo(
          service.id,
          inter ? interAvailablePackages : localAvailablePackages,
        ),
        service,
      };

      if (inter) {
        const countries = convertCountriesForSelect({
          countries: getCountries(
            data.companyPackageId,
            interAvailablePackages,
          ),
          checkedCountries: convertCountriesToArrCodes(
            head(data.deliveriesTo),
            true,
          ),
        });
        company = assoc('countries', countries, company);
      }

      return company;
    };

    render() {
      return (
        <OriginalComponent
          {...this.props}
          {...this.state}
          inter={inter}
          onSaveCompany={this.onSaveCompany}
          onRemoveCompany={this.onRemoveCompany}
          onSetEditableItem={this.onSetEditableItem}
          onRemoveEditableItem={this.onRemoveEditableItem}
        >
          {this.props.children}
        </OriginalComponent>
      );
    }
  };
