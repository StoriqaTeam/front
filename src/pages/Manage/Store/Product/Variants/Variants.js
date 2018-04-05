// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { CreateProductWithAttributesMutation } from 'relay/mutations';
import { log } from 'utils';

import Table from './Table';

import './Variants.scss';

type PropsType = {
  productId: number,
  categoryId: number,
};

type StateType = {
  //
};

class Variants extends Component<PropsType, StateType> {
  state: StateType = {
    //
  };

  handleSave = (variant: {}) => {
    const {
      price,
      vendorCode,
      cashback,
    } = variant;

    const { environment } = this.context;

    CreateProductWithAttributesMutation.commit({
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
        <span>Варианты товара</span>
        <Table
          onSave={this.handleSave}
          categoryId={this.props.categoryId}
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
