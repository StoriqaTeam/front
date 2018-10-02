// @flow strict

import React, { Component } from 'react';
import { map, assoc, find, propEq } from 'ramda';

import { Select } from 'components/common';

import type { SelectItemType } from 'types';
import type { ShippingCountriesType, ServiceType } from './types';

type StateType = {
  services: Array<SelectItemType>,
  service: SelectItemType,
  countries: Array<ShippingCountriesType>,
};

type PropsType = {
  services: Array<ServiceType>,
  service: ?ServiceType, // eslint-disable-line
  handleOnSelectService: (service: ?ServiceType) => void,
};

class ShippingInterSelect extends Component<PropsType, StateType> {
  static getDerivedStateFromProps(nextProps: PropsType) {
    const { services, service } = nextProps;
    return {
      countries: service ? service.countries : [],
      services: map(item => ({ id: item.id, label: item.label }), services),
      service: service ? { id: service.id, label: service.label } : null,
    };
  }

  handleOnSelectService = (item: ?SelectItemType) => {
    if (item) {
      const service = find(propEq('id', item.id))(this.props.services);
      if (service && service.countries) {
        this.props.handleOnSelectService(
          assoc('countries', service.countries, item),
        );
      }
    } else {
      this.props.handleOnSelectService(null);
    }
  };

  render() {
    const { services, service } = this.state;
    return (
      <Select
        forForm
        fullWidth
        label="Service"
        items={services}
        activeItem={service}
        onSelect={this.handleOnSelectService}
        dataTest="shippingInterServiceSelect"
      />
    );
  }
}

export default ShippingInterSelect;
