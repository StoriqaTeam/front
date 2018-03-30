// @flow

import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { pathOr } from 'ramda';

import { Page } from 'components/App';
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
    const productId = pathOr(null, ['me', 'baseProduct', 'rawId'], this.props);
    const categoryId = pathOr(null, ['me', 'baseProduct', 'categoryId'], this.props);
    return (
      <Variants
        productId={productId}
        categoryId={categoryId}
      />
    );
  }
}

export default createFragmentContainer(
  Page(Product),
  graphql`
    fragment Product_me on User
    @argumentDefinitions(productId: { type: "Int!" }) {
      baseProduct(id:$productId) {
        id
        rawId
        name {
          lang
          text
        }
        categoryId
      }
    }
  `,
);

/* categories {
    children {
      children {
        children {
          rawId
          name {
            lang
            text
          }
          getAttributes {
            id
            rawId
            name {
              lang
              text
            }
            valueType
            metaField {
              values
              translatedValues {
                lang
                text
              }
              uiElement
            }
          }
        }
      }
    }
  } */
