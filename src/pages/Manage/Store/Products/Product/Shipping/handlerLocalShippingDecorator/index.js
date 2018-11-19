// @flow strict

import React, { Component } from 'react';
import type { Node, ComponentType } from 'react';
import { prepend, map, difference, filter, isEmpty, addIndex } from 'ramda';

import type { SelectItemType } from 'types';

import {
  convertLocalAvailablePackages,
  getServiceLogo,
  getServiceRawId,
  getService,
} from '../utils';

import type {
  CompanyType,
  FilledCompanyType,
  ShippingChangeDataType,
  ServiceType,
  ShippingType,
  AvailablePackageType,
  PickupShippingType,
} from '../types';

type PropsType = {
  children?: Node,
  currency: SelectItemType,
  localShipping: Array<ShippingType>,
  localAvailablePackages: Array<AvailablePackageType>,
  onChangeShippingData: (data: ShippingChangeDataType) => void,
  pickupShipping: PickupShippingType,
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
      const { localShipping, onChangeShippingData, pickupShipping } = props;
      const companies = addIndex(map)(
        (item, idx) => this.makeCompany(item, idx),
        localShipping,
      );
      const checkedCompanies = filter(
        item => item.companyPackageRawId !== -1,
        companies || [],
      );
      const shippingData = {
        companies: checkedCompanies,
        withoutLocal: Boolean(
          isEmpty(checkedCompanies) && pickupShipping && !pickupShipping.pickup,
        ),
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
    ): Array<ServiceType> =>
      difference(
        convertLocalAvailablePackages(this.props.localAvailablePackages),
        // $FlowIgnore
        map(item => item.service, companies),
      );

    handleOnSaveCompany = (company: CompanyType) => {
      if (company.id !== undefined) {
        this.setState(
          (prevState: StateType) => {
            const { service } = company;
            const newCompany = {
              ...company,
              companyPackageRawId: getServiceRawId({
                id: company.service && company.service.id,
                packages: this.props.localAvailablePackages,
              }),
              logo: getServiceLogo({
                id: company.service && company.service.id,
                packages: this.props.localAvailablePackages,
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
              inter: false,
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
                packages: this.props.localAvailablePackages,
              }),
              logo: getServiceLogo({
                id: company.service && company.service.id,
                packages: this.props.localAvailablePackages,
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
              inter: false,
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
            inter: false,
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
      const { localAvailablePackages, currency } = this.props;
      const service = getService({
        id: data.companyPackageId,
        packages: localAvailablePackages,
      });

      const company = {
        id: `${Date.now()}-${idx}`,
        companyPackageRawId: getServiceRawId({
          id: service && service.id,
          packages: localAvailablePackages,
        }),
        currency,
        price: data.price,
        logo: getServiceLogo({
          id: service && service.id,
          packages: localAvailablePackages,
        }),
        service,
      };

      return company;
    };

    render() {
      const {
        currency,
        error,
        localAvailablePackages,
        localShipping,
        pickupShipping,
        onChangeShippingData,
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
          localAvailablePackages={localAvailablePackages}
          localShipping={localShipping}
          pickupShipping={pickupShipping}
        >
          {this.props.children}
        </OriginalComponent>
      );
    }
  };
