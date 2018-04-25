// @flow

import React, { Component, PureComponent } from 'react';
import { createFragmentContainer, createPaginationContainer, graphql } from 'react-relay';
import PropTypes from 'prop-types';

import { currentUserShape } from 'utils/shapes';
import { Page } from 'components/App';

import type Cart_me from './__generated__/Cart_me.graphql';

type PropsType = {
  me: Cart_me
};

class Cart extends PureComponent<PropsType> {
  render() {
    console.log("-----++-----", this.props.me.cart);
    return (
      <div>"Yo Cart"</div>
    )
  }
}

Cart.contextTypes = {
  environment: PropTypes.object.isRequired,
  directories: PropTypes.object,
  currentUser: currentUserShape,
};

export default createPaginationContainer(
  Page(Cart),
  graphql`
    fragment Cart_me on User 
    @argumentDefinitions(
      first: { type: "Int", defaultValue: null }
      after: { type: "ID", defaultValue: null }
    ) {
      cart(first: $first, after: $after) @connection(key: "Cart_cart") {
        edges {
          node {
            ... on CartProduct {
              quantity
            }
          }
        }
        pageInfo {
          hasNextPage
        }  
      }
    }
  `,
  {
    direction: 'forward',
    getConnectionFromProps: props => props.me && props.me.cart,
    getVariables: (props, { count }, prevFragmentVars) => ({
      first: null,
      after: null,
    }),
    query: graphql`
      query Cart_cart_Query($first: Int, $after: ID) {
        me {
          ...Cart_me @arguments(first: $first, after: $after)
        }
      }
    `,
  },
);
