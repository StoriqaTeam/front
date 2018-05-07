// @flow

import React, { PureComponent } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { pipe, path, pathOr, map, head } from 'ramda';

import { Checkbox } from 'components/Checkbox';
import ShowMore from 'components/ShowMore';
import Stepper from 'components/Stepper';

import CartProductAttribute from './CartProductAttribute';

// eslint-disable-next-line
import type CartProduct_product from './__generated__/CartProduct_product.graphql';
import './CartProduct.scss';

type PropsType = {
  // eslint-disable-next-line
  ...CartProduct_product,
};

/* eslint-disable react/no-array-index-key */
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
      deliveryCost,
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
              {attrs.map((attr, idx) => (
                <div key={idx} styleName="half-width">
                  <CartProductAttribute {...attr} />
                </div>
              ))}
            </div>
            <ShowMore>
              Some details
            </ShowMore>
          </div>
          <div styleName="product-params">
            <div styleName="cart-product-title">Summary</div>
            <CartProductAttribute title="Quantity" value={<Stepper value={quantity} min={0} max={9999} onChange={console.log} />} />
            <CartProductAttribute title="Total cost" value={`${quantity * price} STQ`} />
            <CartProductAttribute title="Delivery cost" value={`${(deliveryCost || 0)} STQ`} />
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
      deliveryCost
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
