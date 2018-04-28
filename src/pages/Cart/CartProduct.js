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
    const {
      photoMain,
      attributes,
      price,
      quantity,
      deliveryPrice,
    } = product;
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
              <div styleName="cart-product-title">
                Attributes
              </div>
              {attrs.map(attr => (
                <div styleName="half-width">
                  <CartProductAttribute {...attr} />
                </div>
              ))}
            </div>
            <ShowMore>
              Some details
            </ShowMore>
          </div>
          <div styleName="product-params">
            <div styleName="cart-product-title">Price and cost</div>
            <CartProductAttribute title="Quantity" value={quantity} />
            <CartProductAttribute title="Total cost" value={(quantity * price).toString()} />
            <CartProductAttribute title="Delivery cost" value={(deliveryPrice || 0).toString()} />
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
      photoMain
      price
      quantity
      deliveryPrice
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
