// @flow

import React, { PureComponent } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { pipe, path, pathOr, map, head } from 'ramda';

import { Checkbox } from 'components/Checkbox';
import ShowMore from 'components/ShowMore';

import CartProductAttribute from './CartProductAttribute';

// eslint-disable-next-line
import type CartProduct_product from './__generated__/CartProduct_product.graphql';
import './CartProduct.scss';

type PropsType = {
  // eslint-disable-next-line
  ...CartProduct_product,
};

class CartProduct extends PureComponent<PropsType> {
  render() {
    const { product } = this.props;
    if (!product) return null;
    const name = pipe(
      pathOr([], ['name']),
      head,
      path(['text']),
    )(product);
    const { photoMain, attributes } = product;
    const attrs = map(attr => (
      { title: head(attr.attribute.name).text, value: attr.value.toString() }
    ))(attributes);
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
            Params
          </div>
        </div>
      </div>
    );
  }
}

export default createFragmentContainer(
  CartProduct,
  graphql`
    fragment CartProduct_product on CartProduct {
      id
      name {
        lang
        text
      }
      quantity
      attributes {
        value
        metaField
        attribute {
          name {
            lang
            text
          }  
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
        }
      }
    }
`,
);
