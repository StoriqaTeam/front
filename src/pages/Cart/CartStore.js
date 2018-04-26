// @flow

import React, { Component, PureComponent } from 'react';
import { createFragmentContainer, createPaginationContainer, graphql } from 'react-relay';
import PropTypes from 'prop-types';

import { currentUserShape } from 'utils/shapes';
import { Page } from 'components/App';

import './CartStore.scss';

type PropsType = {};

class CartStore extends PureComponent<PropsType> {
  render() {
    console.log("-----++-----", this.props.store);
    return (
      <div styleName="container">
        <div styleName="header">Cart</div>
      </div>
    )
  }
}

export default CartStore;
