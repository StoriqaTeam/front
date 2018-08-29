// @flow

import React, { Component } from 'react';
import {
  head,
  last,
  slice,
  append,
  prepend,
  propEq,
  findIndex,
  concat,
  length,
  map,
  difference,
  filter,
  find,
  isEmpty,
  dissoc,
} from 'ramda';

import type { SelectType } from 'types';
import type { CompanyType } from './types';

type PropsType = {};

type StateType = {
  companies: Array<CompanyType>,
  remainingServices: Array<SelectType>,
  possibleServices: Array<SelectType>,
  remainingCountries: Array<SelectType>,
  possibleCountries: Array<SelectType>,
  editableItemId: ?string,
};

const services: Array<SelectType> = [
  { id: 'ups', label: 'Ups' },
  { id: 'fedex', label: 'FedEx' },
  { id: 'post', label: 'Post of Russia' },
];

const servicesWithCountries: Array<SelectType> = [
  {
    id: 'ups',
    label: 'Ups',
    countries: [
      { id: 'all', label: 'All countries' },
      { id: 'us', label: 'United States' },
      { id: 'ru', label: 'Russian Federation' },
    ],
  },
  {
    id: 'fedex',
    label: 'FedEx',
    countries: [
      { id: 'all', label: 'All countries' },
      { id: 'rs', label: 'Serbia' },
      { id: 'tk', label: 'Tokelau' },
      { id: 'ye', label: 'Yemen' },
    ],
  },
  {
    id: 'post',
    label: 'Post of Russia',
    countries: [
      { id: 'all', label: 'All countries' },
      { id: 'rw', label: 'Rwanda' },
      { id: 'sm', label: 'San Marino' },
      { id: 'gf', label: 'French Guiana' },
      { id: 'il', label: 'Israel' },
    ],
  },
];

const countries: Array<SelectType> = [
  { id: 'all', label: 'All countries' },
  { id: 'us', label: 'United States' },
  { id: 'ru', label: 'Russian Federation' },
];

export default (OriginalComponent: any, inter?: boolean) =>
  class HandlerShippingDecorator extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
      super(props);
      const servicess = map(
        item => dissoc('countries', item),
        servicesWithCountries,
      );
      this.state = {
        companies: [],
        editableItemId: null,
        remainingServices: inter ? servicess : services,
        possibleServices: inter ? servicess : services,
        remainingCountries: countries,
        possibleCountries: countries,
        countries,
        servicesWithCountries,
      };
    }

    onSaveCompany = (company: CompanyType) => {
      // console.log('---company', company);
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
          const newCompanies = map(item => {
            if (item.id === company.id) {
              return { ...company, img };
            }
            return { ...item };
          }, prevState.companies);
          return {
            companies: newCompanies,
            remainingServices: this.differenceServices(newCompanies),
            editableItemId: null,
          };
        });
      } else {
        this.setState((prevState: StateType) => {
          const newCompany = {
            ...company,
            id: `${length(prevState.companies)}`,
            img,
          };
          const newCompanies = prepend(newCompany, prevState.companies);
          // const remainingServices = this.differenceServices(newCompanies);
          // console.log('---remainingServices', remainingServices);
          if (inter) {
            this.redistributeCountries(company);
          }
          return {
            companies: newCompanies,
            remainingServices: inter
              ? prevState.remainingServices
              : this.differenceServices(newCompanies),
            editableItemId: null,
          };
        });
      }
    };

    onRemoveCompany = (id: string) => {
      this.setState((prevState: StateType) => {
        const newCompanies = filter(
          item => id !== item.id,
          prevState.companies,
        );
        return {
          companies: newCompanies,
          remainingServices: this.differenceServices(newCompanies),
          editableItemId: null,
        };
      });
    };

    onSetEditableItem = (id: string) => {
      this.setState((prevState: StateType) => {
        const { companies } = prevState;
        const thisCompany = find(propEq('id', id))(companies);
        const differenceArr = difference(
          services,
          map(item => item.service, companies),
        );
        return {
          editableItemId: id,
          // $FlowIgnore
          possibleServices: prepend(thisCompany.service, differenceArr),
        };
      });
    };

    onRemoveEditableItem = () => {
      this.setState({ editableItemId: null });
    };

    differenceServices = (companies: Array<CompanyType>) =>
      difference(services, map(item => item.service, companies));

    redistributeCountries = (company: any) => {
      // console.log('---company', company);
      const services = this.state.servicesWithCountries;
      // console.log('---services', services);
      const newServices = filter(
        item => !isEmpty(item.countries),
        map(item => {
          if (item.id === company.service.id) {
            // console.log('---item', item);
            const countries = filter(
              item => item.id !== company.country.id,
              item.countries,
            );
            console.log('---countries', countries);
            return { ...item, countries };
          }
          return item;
        }, services),
      );
      console.log(
        '---services',
        map(item => dissoc('countries', item), newServices),
      );
      this.setState({
        servicesWithCountries: newServices,
        remainingServices: map(item => dissoc('countries', item), newServices),
      });
    };

    render() {
      console.log(
        '---STATE servicesWithCountries',
        this.state.servicesWithCountries,
      );
      return (
        <OriginalComponent
          {...this.props}
          {...this.state}
          inter={inter}
          onSaveCompany={this.onSaveCompany}
          onRemoveCompany={this.onRemoveCompany}
          onSetEditableItem={this.onSetEditableItem}
          onRemoveEditableItem={this.onRemoveEditableItem}
          redistributeCountries={this.redistributeCountries}
        >
          {this.props.children}
        </OriginalComponent>
      );
    }
  }; // eslint-disable-line
