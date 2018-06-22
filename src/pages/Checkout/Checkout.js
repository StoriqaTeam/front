// @flow
/* eslint-disable no-underscore-dangle */

import React, { Component } from 'react';
import { createPaginationContainer, graphql } from 'react-relay';
import PropTypes from 'prop-types';
import {
  pipe,
  pathOr,
  path,
  map,
  prop,
  propEq,
  groupBy,
  filter,
  reject,
  isNil,
  reduce,
  head,
  defaultTo,
} from 'ramda';

import { Page } from 'components/App';
import { Row, Col } from 'layout';

// eslint-disable-next-line
import type Cart_cart from '../Cart/__generated__/Cart_cart.graphql';

import './Checkout.scss';

type PropsType = {
  // eslint-disable-next-line
  cart: Cart_cart,
};

type Totals = {};

type StateType = {};

/* eslint-disable react/no-array-index-key */
class Checkout extends Component<PropsType, StateType> {
  state = {};

  componentWillMount() {}

  componentWillUnmount() {}

  render() {
    return <div styleName="container" />;
  }
}

export default Page(Checkout);
