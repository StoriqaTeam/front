// @flow

import React, { Component, PureComponent } from 'react';
import { createFragmentContainer, createPaginationContainer, graphql } from 'react-relay';
import PropTypes from 'prop-types';
import { pipe, path, pathOr, map, head } from 'ramda';

import { currentUserShape } from 'utils/shapes';
import { Page } from 'components/App';
import { Checkbox } from 'components/Checkbox';
import ShowMore from 'components/ShowMore';

import CartProductAttribute from './CartProductAttribute';

import './CartProduct.scss';

type PropsType = {};

class CartProduct extends PureComponent<PropsType> {
  render() {
    let { product } = this.props;
    if (!product) return null;
    console.log("Product:", product);
    const name = pipe(
      pathOr([], ['name']),
      head,
      path(['text']),
    )(product);
    product = pipe(
      pathOr([], ['products', 'edges']),
      map(path(['node'])),
      head,
    )(product);
    const { price, photoMain, attributes } = product;
    console.log('lksfjldfkjg', attributes);
    const attrs = map(attr => ({ title: head(attr.attribute.name).text, value: attr.value.toString() }))(attributes);
    console.log('attrs', attrs);
    return (
      <div styleName="container">
        <div styleName="left-container">
          <div styleName="checkbox">
            <Checkbox
              id={`Cartproduct_${product.rawId}`}
              label={false}
              isChecked
              onChange={() => { }}
            />
          </div>
          <img src={photoMain} styleName="picture" alt="product_picture" />
        </div>
        <div styleName="main-container">
          <div styleName="product-summary">
            <div styleName="product-summary-header">{name}</div>
            <div styleName="product-summary-attributes">
              <div styleName="product-summary-attributes-title">
                Attributes
              </div>
              {attrs.map(attr => (
                <CartProductAttribute {...attr} />
              ))}
            </div>
            <ShowMore>
              Yo1h
            </ShowMore>
          </div>
          <div styleName="product-params">

          </div>
        </div>
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
        name {
          lang
        text
        }
      products {
          edges {
        node {
          ...on Product {
          photoMain
              price
        attributes {
          attribute {
        valueType
                  metaField {
          values
                    uiElement
        translatedValues {
          translations {
        lang
        text
      }
    }
  }
                  name {
          lang
                    text
        }
      }
      value
      metaField
    }
  }
}
}
}
}
`,
);
