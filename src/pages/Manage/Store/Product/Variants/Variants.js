// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { pathOr, map, prop, flatten, filter, reduce, merge } from 'ramda';

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

  getCategoriesWithAttributes = (categories: {}) => {
    const lvl1Childs = prop('children', categories);
    const lvl2Childs = flatten(map(prop('children'), lvl1Childs));
    const lvl3Childs = flatten(map(prop('children'), lvl2Childs));
    const categoriesWithAttrs = filter(item => prop('length', prop('getAttributes', item)) > 0, lvl3Childs);
    const filtered = map(item => ({ [item.rawId]: item.getAttributes }), categoriesWithAttrs);
    return reduce(merge, {}, filtered);
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
    log.debug('Variants', { props: this.props });
    const categoriesWithAttrs = this.getCategoriesWithAttributes(
      this.context.directories.categories,
    );
    log.debug({ categoriesWithAttrs });
    // log.debug({ category: categoriesWithAttrs[this.props.categoryId] })
    return (
      <div styleName="container">
        <span>Варианты товара</span>
        <Table onSave={this.handleSave} />
      </div>
    );
  }
}

Variants.contextTypes = {
  environment: PropTypes.object.isRequired,
  directories: PropTypes.object,
};

export default Variants;
