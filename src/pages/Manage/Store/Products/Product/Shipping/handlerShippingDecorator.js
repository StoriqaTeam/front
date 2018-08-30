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
  mergeAll,
  dropRepeats,
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
        possibleCountries: [],
        countries,
        servicesWithCountries,
        editableCompany: null,
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
          if (inter) {
            this.redistributeServices(company);
          }
          return {
            companies: newCompanies,
            remainingServices: inter
              ? prevState.remainingServices
              : this.differenceServices(newCompanies),
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
            this.redistributeServices(company);
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
          this.redistributeServicesRemove(company);
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

    onSetEditableItem = (company: any) => {
      this.setState((prevState: StateType) => {
        const { remainingServices } = prevState;
        // console.log('---remainingServices', remainingServices);
        // const { companies } = prevState;
        // // console.log('---companies', companies);
        // const thisCompany = find(propEq('id', company.id))(companies);
        // const differenceArr = difference(
        //   services,
        //   map(item => item.service, companies),
        // );
        if (inter) {
          this.redistributeCountries(company);
        }
        // console.log('---possibleServices', dropRepeats(prepend(company.service, remainingServices)));
        return {
          editableCompany: company,
          editableItemId: company.id,
          // $FlowIgnore
          possibleServices: prepend(
            company.service,
            filter(item => company.service.id !== item.id, remainingServices),
          ),
        };
      });
    };

    onRemoveEditableItem = () => {
      this.setState({ editableItemId: null });
    };

    differenceServices = (companies: Array<CompanyType>) =>
      difference(services, map(item => item.service, companies));

    redistributeCountries = (company: any) => {
      const { companies, servicesWithCountries: servicesState } = this.state;
      const serviceFromBack = find(propEq('id', company.service.id))(
        servicesWithCountries,
      );
      const usedCountries = map(
        item => item.country,
        filter(
          item =>
            company.service.id === item.service.id &&
            company.country.id !== item.country.id,
          companies,
        ),
      );
      const possibleCountries = difference(
        serviceFromBack.countries,
        usedCountries,
      );

      let newServices;

      if (find(propEq('id', company.service.id))(servicesState)) {
        newServices = map(item => {
          if (item.id === company.service.id) {
            return {
              ...item,
              countries: prepend(company.country, item.countries),
            };
          }
          return item;
        }, servicesState);
      } else {
        newServices = prepend(
          { ...company.service, countries: [company.country] },
          servicesState,
        );
      }

      this.setState({
        // possibleCountries,
        possibleServicesWithCountries: newServices,
      });
    };

    redistributeServices = (company: any) => {
      const services = this.state.servicesWithCountries;
      console.log('---services', services);
      if (company.id) {
        console.log('---company', company);
        const { editableCompany } = this.state;
        console.log('---editableCompany', editableCompany);

        const newServices = this.addCompany(company);
      } else {
        const newServices = this.addCompany(company);
        this.setState({
          servicesWithCountries: newServices,
          remainingServices: map(
            item => dissoc('countries', item),
            newServices,
          ),
        });
      }
    };

    addCompany = (company: any) => {
      const services = this.state.servicesWithCountries;
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
      return newServices;
    };

    redistributeServicesRemove = (company: any) => {
      const servicesFromState = this.state.servicesWithCountries;
      const serviceFromState = find(propEq('id', company.service.id))(
        servicesFromState,
      );
      const serviceFromBack = find(propEq('id', company.service.id))(
        servicesWithCountries,
      );

      if (serviceFromState) {
        const newCountries = append(
          company.country,
          serviceFromState.countries,
        );
        const newCountriesSort = serviceFromBack.countries;
        const countriesReady = filter(
          item => contains(item, newCountries),
          newCountriesSort,
        );
        this.setState(() => {
          const newServices = map(item => {
            if (item.id === company.service.id) {
              return { ...item, countries: countriesReady };
            }
            return item;
          }, servicesFromState);
          return {
            servicesWithCountries: newServices,
            remainingServices: map(
              item => dissoc('countries', item),
              newServices,
            ),
          };
        });
      } else {
        const newServicesState = append(
          { ...serviceFromBack, countries: [company.country] },
          servicesFromState,
        );
        const newServicesSort = map(
          item => {
            const serviceInState = find(propEq('id', item.id))(
              newServicesState,
            );
            return { ...item, countries: serviceInState.countries };
          },
          filter(item => {
            return contains(
              item.id,
              map(service => service.id, newServicesState),
            );
          }, servicesWithCountries),
        );
        this.setState({
          servicesWithCountries: newServicesSort,
          remainingServices: map(
            item => dissoc('countries', item),
            newServicesSort,
          ),
        });
      }
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
        >
          {this.props.children}
        </OriginalComponent>
      );
    }
  }; // eslint-disable-line
