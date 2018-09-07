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

import type {
  ServicesType,
  ServicesInterType,
  CompanyType,
  CompaniesType,
  CompaniesInterType,
} from './types';

type PropsType = {
  children: Array<Node>,
};

type StateType = {
  companies: Array<CompanyType>,
  editableItemId: ?string,
  remainingServices: ServicesType | ServicesInterType,
  possibleServices: ServicesType | ServicesInterType,
};

const services: ServicesType = [
  { id: 'ups', label: 'Ups' },
  { id: 'fedex', label: 'FedEx' },
  { id: 'post', label: 'Post of Russia' },
];

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
  },
];

export default (OriginalComponent: any, inter?: boolean) =>
  class HandlerShippingDecorator extends Component<PropsType, StateType> {
    state: StateType = {
      companies: [],
      editableItemId: null,
      remainingServices: inter ? servicesWithCountries : services,
      possibleServices: inter ? servicesWithCountries : services,
    };

    onSaveCompany = (company: CompanyType) => {
      let img = '';
      switch (company.service.id) {
        case 'ups':
          img =
            'https://s3.us-east-1.amazonaws.com/storiqa-dev/img-BJlKQe5H9p0C.png';
          break;
        case 'fedex':
          img =
            'https://s3.us-east-1.amazonaws.com/storiqa-dev/img-zakbquXuoLUC.png';
          break;
        case 'post':
          img =
            'https://s3.eu-west-2.amazonaws.com/storiqa/img-71Wnx40FWb8C.png';
          break;
        default:
          img = '';
      }
      if (company.id) {
        this.setState((prevState: StateType) => {
          const newCompany = {
            ...company,
            img,
            // $FlowIgnore
            service: dissoc('countries', company.service),
          };
          const newCompanies = map(
            item => (item.id === company.id ? newCompany : item),
            prevState.companies,
          );
          const remainingServices = inter
            // $FlowIgnore
            ? this.setRemainingServicesInter(newCompanies)
            // $FlowIgnore
            : this.setRemainingServices(newCompanies);
          return {
            // $FlowIgnore
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
            img,
            // $FlowIgnore
            service: dissoc('countries', company.service),
          };
          const newCompanies = prepend(newCompany, prevState.companies);
          const remainingServices = inter
            // $FlowIgnore
            ? this.setRemainingServicesInter(newCompanies)
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
          // $FlowIgnore
          ? this.setRemainingServicesInter(newCompanies)
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
          // $FlowIgnore
          ? this.setRemainingServicesInter(newCompanies)
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
      // $FlowIgnore
      difference(services, map(item => item.service, companies));

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
