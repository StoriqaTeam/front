// @flow

import React, { Component, PureComponent } from 'react';
import { createFragmentContainer, createPaginationContainer, graphql } from 'react-relay';
import PropTypes from 'prop-types';
import { pipe, path, map } from 'ramda';

import { currentUserShape } from 'utils/shapes';
import { Page } from 'components/App';
import { Checkbox } from 'components/Checkbox';

import './CartStore.scss';

type PropsType = {};

class CartProduct extends PureComponent<PropsType> {
  render() {
    const { product } = this.props;
    console.log("Product:", product);
    return (
      <div>
        <Checkbox
          id={`Cartproduct_${product.rawId}`}
          label={false}
          isChecked
          onChange={() => { }}
        />
      </div>
    );
  }
}

export default createFragmentContainer(
  CartProduct,
  graphql`
    fragment CartProduct_product on BaseProduct {
      id
      isActive
    }
  `,
);
