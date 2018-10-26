// @flow strict

import React, { Component } from 'react';
import { map, find, propEq } from 'ramda';

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

class ShippingLocalSelect extends Component<PropsType, StateType> {
  static getDerivedStateFromProps(nextProps: PropsType) {
    const { services, service } = nextProps;
    return {
      currency: service ? service.currency : null,
      services: map(item => ({ id: item.id, label: item.label }), services),
      service: service ? { id: service.id, label: service.label } : null,
    };
  }

  handleOnSelectService = (item: ?SelectItemType) => {
    if (item) {
      const service = find(propEq('id', item.id))(this.props.services);
      if (service && service.currency) {
        this.props.handleOnSelectService({
          ...item,
          currency: service.currency,
        });
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
        dataTest="shippingLocalServiceSelect"
      />
    );
  }
}

export default ShippingLocalSelect;
