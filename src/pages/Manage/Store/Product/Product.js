// @flow

import React, { Component } from 'react';

import { log } from 'utils';

import Variants from './Variants/Variants';

type PropsType = {
  //
};

type StateType = {
  //
};

class Product extends Component<PropsType, StateType> {
  state: StateType = {
    //
  };

  render() {
    log.debug({ props: this.props });
    return (
      <Variants productId={this.props.params.productId} />
    );
  }
}

export default Product;
