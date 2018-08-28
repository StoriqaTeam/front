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

const interServices: Array<SelectType> = [
  {
    id: 'ups',
    label: 'Ups',
    countries: [
      { id: 'all', label: 'All countries' },
      { id: 'rw', label: 'Rwanda' },
      { id: 'sm', label: 'San Marino' },
      { id: 'gf', label: 'French Guiana' },
      { id: 'il', label: 'Israel' },
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
      { id: 'us', label: 'United States' },
      { id: 'ru', label: 'Russian Federation' },
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
      const servicess = map(item => item, interServices);
      this.state = {
        companies: [],
        editableItemId: null,
        remainingServices: inter ? servicess : services,
        possibleServices: inter ? servicess : services,
        remainingCountries: countries,
        possibleCountries: countries,
        interServices,
      };
    }

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
          return {
            companies: newCompanies,
            remainingServices: this.differenceServices(newCompanies),
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

    redistributeCountries = (service: SelectType) => {
      // console.log('---service', service);
      const selectedService = find(propEq('id', service.id))(interServices);
      // console.log('---selectedService', selectedService);
      this.setState({ remainingCountries: selectedService.countries });
    };

    render() {
      console.log('---this.state.companies', this.state.companies);
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
