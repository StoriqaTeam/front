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
} from 'ramda';

import {
  convertLocalAvailablePackages,
  getServiceLogo,
  convertInterAvailablePackages,
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
  localAvailablePackages: LocalAvailablePackagesType,
  interAvailablePackages: InterAvailablePackagesType,
};

type StateType = {
  companies: Array<CompanyType>,
  editableItemId: ?string,
  remainingServices: ServicesType | ServicesInterType,
  possibleServices: ServicesType | ServicesInterType,
};

// const services: ServicesType = [
//   { id: 'ups', label: 'Ups' },
//   { id: 'fedex', label: 'FedEx' },
//   { id: 'post', label: 'Post of Russia' },
// ];

const servicesWithCountries: ServicesInterType = [
  {
    id: 'ups',
    label: 'Ups',
    countries: [
      { id: 'all', label: 'All countries' },
      { id: 'tk', label: 'Tokelau' },
      { id: 'us', label: 'United States' },
      { id: 'ru', label: 'Russian Federation' },
    ],
    logo: 'https://s3.us-east-1.amazonaws.com/storiqa-dev/img-BJlKQe5H9p0C.png',
  },
  {
    id: 'fedex',
    label: 'FedEx',
    countries: [
      // { id: 'all', label: 'All countries' },
      { id: 'rs', label: 'Serbia' },
      { id: 'tk', label: 'Tokelau' },
      // { id: 'ye', label: 'Yemen' },
    ],
    logo: 'https://s3.us-east-1.amazonaws.com/storiqa-dev/img-BJlKQe5H9p0C.png',
  },
  {
    id: 'post',
    label: 'Post of Russia',
    countries: [
      // { id: 'all', label: 'All countries' },
      { id: 'rw', label: 'Rwanda' },
      { id: 'sm', label: 'San Marino' },
      { id: 'gf', label: 'French Guiana' },
      // { id: 'il', label: 'Israel' },
    ],
    logo: 'https://s3.us-east-1.amazonaws.com/storiqa-dev/img-BJlKQe5H9p0C.png',
  },
];

export default (OriginalComponent: any, inter?: boolean) =>
  class HandlerShippingDecorator extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
      super(props);

      this.state = {
        companies: [],
        editableItemId: null,
        remainingServices: inter
          ? convertInterAvailablePackages(props.interAvailablePackages)
          : convertLocalAvailablePackages(props.localAvailablePackages),
        possibleServices: inter
          ? convertInterAvailablePackages(props.interAvailablePackages)
          : convertLocalAvailablePackages(props.localAvailablePackages),
      };
    }

    onSaveCompany = (company: CompanyType) => {
      if (company.id) {
        this.setState((prevState: StateType) => {
          const newCompany = {
            ...company,
            logo: getServiceLogo(
              company.service.id,
              this.props.localAvailablePackages,
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
              this.setRemainingServices(newCompanies);
          return {
            companies: newCompanies,
            remainingServices,
            editableItemId: null,
          };
        });
      } else {
        this.setState((prevState: StateType) => {
          const newCompany = {
            ...company,
            id: `${Date.now()}`,
            logo: getServiceLogo(
              company.service.id,
              this.props.localAvailablePackages,
            ),
            service: dissoc('countries', company.service),
          };
          // $FlowIgnore
          const newCompanies = prepend(newCompany, prevState.companies);
          const remainingServices = inter
            ? // $FlowIgnore
              this.setRemainingServicesInter(newCompanies)
            : this.setRemainingServices(newCompanies);
          return {
            companies: newCompanies,
            remainingServices,
            editableItemId: null,
          };
        });
      }
    };

    onRemoveCompany = (company: any) => {
      this.setState((prevState: StateType) => {
        const newCompanies = filter(
          item => company.id !== item.id,
          prevState.companies,
        );
        const remainingServices = inter
          ? // $FlowIgnore
            this.setRemainingServicesInter(newCompanies)
          : this.setRemainingServices(newCompanies);
        return {
          companies: newCompanies,
          remainingServices,
          editableItemId: null,
        };
      });
    };

    onSetEditableItem = (company: any) => {
      this.setState((prevState: StateType) => {
        const newCompanies = filter(
          item => company.id !== item.id,
          prevState.companies,
        );
        const possibleServices = inter
          ? // $FlowIgnore
            this.setRemainingServicesInter(newCompanies)
          : this.setRemainingServices(newCompanies);
        return {
          editableItemId: company.id,
          possibleServices,
        };
      });
    };

    onRemoveEditableItem = () => {
      this.setState({ editableItemId: null });
    };

    setRemainingServices = (companies: CompaniesType) =>
      difference(
        convertLocalAvailablePackages(this.props.localAvailablePackages),
        map(item => item.service, companies),
      );

    setRemainingServicesInter = (companies: CompaniesInterType) => {
      let defaultServices = servicesWithCountries;
      forEach(company => {
        defaultServices = map(item => {
          if (item.id === company.service.id) {
            return {
              ...item,
              countries: filter(
                country => country.id !== company.country.id,
                item.countries,
              ),
            };
          }
          return item;
        }, defaultServices);
      }, companies);

      const filteredDefaultServices = filter(
        item => !isEmpty(item.countries),
        defaultServices,
      );
      return filteredDefaultServices;
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
