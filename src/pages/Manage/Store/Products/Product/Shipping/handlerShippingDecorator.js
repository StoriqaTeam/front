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
  mergeDeepLeft,
  contains,
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
  servicesWithCountries: Array<SelectType>,
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
      // { id: 'us', label: 'United States' },
      // { id: 'ru', label: 'Russian Federation' },
    ],
  },
  {
    id: 'fedex',
    label: 'FedEx',
    countries: [
      // { id: 'all', label: 'All countries' },
      { id: 'rs', label: 'Serbia' },
      // { id: 'tk', label: 'Tokelau' },
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
            id: `${company.service.id}${
              company.country ? company.country.id : ''
            }`,
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

    onRemoveCompany = (company: any) => {
      this.setState((prevState: StateType) => {
        const newCompanies = filter(
          item => company.id !== item.id,
          prevState.companies,
        );
        if (inter) {
          this.redistributeCountriesRemove(company);
        }
        return {
          companies: newCompanies,
          remainingServices: inter
            ? prevState.remainingServices
            : this.differenceServices(newCompanies),
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
            const countries = filter(
              item => item.id !== company.country.id,
              item.countries,
            );
            return { ...item, countries };
          }
          return item;
        }, services),
      );
      this.setState({
        servicesWithCountries: newServices,
        remainingServices: map(item => dissoc('countries', item), newServices),
      });
    };

    redistributeCountriesRemove = (company: any) => {
      console.log('---company', company);
      const servicesFromState = this.state.servicesWithCountries;
      const serviceFromState = find(propEq('id', company.service.id))(
        servicesFromState,
      );
      const serviceFromBack = find(propEq('id', company.service.id))(
        servicesWithCountries,
      );

      if (serviceFromState) {
        const newCountries = prepend(
          company.country,
          serviceFromState.countries,
        );
        const newCountriesSort = serviceFromBack.countries;
        const countriesReady = filter(
          item => contains(item, newCountries),
          newCountriesSort,
        );
        // console.log('---countriesReady', countriesReady);
        this.setState(() => {
          const newServices = map(item => {
            if (item.id === company.service.id) {
              return { ...item, countries: countriesReady };
            }
            return item;
          }, servicesFromState);
          return {
            servicesWithCountries: newServices,
          };
        });
      } else {
        const newServices = prepend(
          { ...serviceFromBack, countries: [company.country] },
          servicesFromState,
        );
        console.log('---newServices', newServices);
        // this.setState({
        //   servicesWithCountries:
        // });
      }

      // const servicesWithCountriess = servicesWithCountries;
      // console.log('---servicesWithCountries', servicesWithCountries);
      // console.log('---serviceId, countryId', serviceId, countryId);
      // if (find(propEq('id', serviceId))(services)) {
      //   // добавить страну
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //   // const newServices = map(item => {
      //   //   const serviceFromBacks = find(propEq('id', serviceId))(servicesWithCountries);
      //   //   const serviceFromState = find(propEq('id', serviceId))(servicesFromState);
      //   //   console.log('---serviceFromBacks', serviceFromBacks);
      //   //   const countriesFromState = serviceFromBacks.countries; // взять страны удаленного сервиса из исходного массива
      //   //   if (item.id === serviceId) {
      //   //     return { ...item, countries: countriesFromBack };
      //   //   }
      //   //   return item;
      //   // }, servicesWithCountries);
      //   // console.log('---newServices', newServices);
      //   // this.setState({ servicesWithCountries: newServices });
      // } else {
      //   //
      // }
      // this.setState({
      //   servicesWithCountries: newServices,
      //   remainingServices: map(item => dissoc('countries', item), newServices),
      // });
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
