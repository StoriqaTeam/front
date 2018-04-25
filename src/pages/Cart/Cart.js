// @flow

import React, { Component, PureComponent } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import PropTypes from 'prop-types';

import { currentUserShape } from 'utils/shapes';
import { Page } from 'components/App';

import type Cart_me from './__generated__/Cart_me.graphql';

type PropsType = {
  me: Cart_me
};

class Cart extends PureComponent<PropsType> {
  render() {
    console.log("-----+-------", this.props.me.cart.pageInfo);
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

export default createFragmentContainer(
  Page(Cart),
  graphql`
    fragment Cart_me on User {
      cart {
        pageInfo {
          hasNextPage
        }  
      }
    }
  `,
);
