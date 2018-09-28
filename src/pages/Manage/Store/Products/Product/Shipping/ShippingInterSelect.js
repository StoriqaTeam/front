// @flow

import React, { Component } from 'react';
import { map, assoc, dissoc } from 'ramda';

import { Select } from 'components/common';

type StateType = {
  services: any,
  service: any,
  countries: any,
};

type PropsType = {
  services: any,
  service: any,
  handleOnSelectService: any,
};

class ShippingInterSelect extends Component<PropsType, StateType> {
  static getDerivedStateFromProps(nextProps: PropsType, prevState: StateType) {
    return {
      countries: nextProps.service ? nextProps.service.countries : [],
      services: map(item => dissoc('countries', item), nextProps.services),
      service: dissoc('countries', nextProps.service),
    };
  }

  // constructor(props: PropsType) {
  //   super(props);
  //   console.log('---props', props);
  //   this.state = {
  //     countries: props.service ? props.service.countries : [],
  //     services: map(item => dissoc('countries', item), props.services),
  //     service: dissoc('countries', props.service),
  //   };
  // }

  handleOnSelectService = (item: any) => {
    const { countries } = this.state;
    this.props.handleOnSelectService(assoc('countries', countries, item));
  };

  render() {
    console.log('---this.state', this.state);
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
