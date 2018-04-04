// @flow

import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';

import { Page } from 'components/App';

type PropsType = {
  //
};

type StateType = {
  //
};

class EditProduct extends Component<PropsType, StateType> {
  state: StateType = {
    //
  };
  render() {
    return (
      <div>Hi!</div>
    );
  }
}

export default createFragmentContainer(
  Page(EditProduct),
  graphql`
    fragment EditProduct_me on User
    @argumentDefinitions(productId: { type: "Int!" }) {
      baseProduct(id:$productId) {
        id
        rawId
        categoryId
        storeId
        name {
          lang
          text
        }
        shortDescription {
          lang
          text
        }
        longDescription {
          lang
          text
        }
        seoTitle {
          lang
          text
        }
        seoDescription {
          lang
          text
        }
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
