// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { CreateProductWithAttributesMutation } from 'relay/mutations';
import { log } from 'utils';

import Table from './Table/Table';

import './Variants.scss';

type PropsType = {
  productId: number,
  category: {},
  variants: Array<{ rawId: number }>,
  storeID: string,
};

type StateType = {
  //
};

class Variants extends Component<PropsType, StateType> {
  state: StateType = {
    //
  };

  handleSave = (variant: { [string]: any }) => {
    const { price, vendorCode, cashback } = variant;

    const { environment } = this.context;

    CreateProductWithAttributesMutation.commit({
      storeID: this.props.storeID,
      baseProductId: parseInt(this.props.productId, 10),
      price,
      vendorCode,
      cashback,
      environment,
      onCompleted: (response: ?Object, errors: ?Array<Error>) => {
        log.debug({
          response,
          errors,
        });
      },
    });
  };

  render() {
    return (
      <div styleName="container">
        <div styleName="title">
          <strong>Variants</strong>
        </div>
        <Table
          onSave={this.handleSave}
          category={this.props.category}
          variants={this.props.variants}
          productId={this.props.productId}
          storeID={this.props.storeID}
        />
      </div>
    );
  }
}

Variants.contextTypes = {
  environment: PropTypes.object.isRequired,
  directories: PropTypes.object,
};

export default Variants;
