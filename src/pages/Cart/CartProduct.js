// @flow

import React, { PureComponent } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { pipe, path, pathOr, map, head } from 'ramda';
import PropTypes from 'prop-types';

import { Checkbox } from 'components/Checkbox';
import ShowMore from 'components/ShowMore';
import Stepper from 'components/Stepper';
import { Select } from 'components/common/Select';
import { SetInCartMutation } from 'relay/mutations';
import { log } from 'utils';

import CartProductAttribute from './CartProductAttribute';
import Recycle from './svg/recycle.svg';

// eslint-disable-next-line
import type CartProduct_product from './__generated__/CartProduct_product.graphql';
import './CartProduct.scss';

type PropsType = {
  // eslint-disable-next-line
  ...CartProduct_product,
};

/* eslint-disable react/no-array-index-key */
class CartProduct extends PureComponent<PropsType> {
  handleQuantityChange(newVal) {
    const id = this.props.product.rawId;
    SetInCartMutation.commit({
      input: { clientMutationId: '', productId: id, quantity: newVal },
      environment: this.context.environment,
      onCompleted: (response, errors) => {
        log.debug('Success for SetInCart mutation');
        if (response) { log.debug('Response: ', response); }
        if (errors) { log.debug('Errors: ', errors); }
      },
      onError: (error) => {
        log.error('Error in SetInCart mutation');
        log.error(error);
        // eslint-disable-next-line
        alert('Unable to set product quantity in cart');
      },
    });
  }

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
        <button styleName="recycle">
          <Recycle />
        </button>
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
              <div styleName="delivery-container">
                <div styleName="cart-product-title">
                  Delivery and return
                </div>
                <div styleName="half-width">
                  <CartProductAttribute
                    title="Delivery"
                    value={
                      <Select
                        items={[{ id: 1, label: 'DHL' }, { id: 2, label: 'Boxberry' }]}
                        activeItem={{ id: 1, label: 'DHL' }}
                        forForm
                        containerStyle={{ width: '24rem' }}
                      />
                    }
                  />
                </div>
                <div styleName="half-width">
                  <CartProductAttribute title="Delivery term" value="14 days" />
                </div>
                <div styleName="half-width">
                  <CartProductAttribute title="Return policy" value="Replacement or cash" />
                </div>
                <div styleName="half-width">
                  <CartProductAttribute title="Delivery return terms" value="Paid by seller" />
                </div>
              </div>
            </ShowMore>
          </div>
          <div styleName="product-params">
            <div styleName="cart-product-title">Summary</div>
            <CartProductAttribute
              title="Quantity"
              value={
                <Stepper
                  value={quantity}
                  min={0}
                  max={9999}
                  onChange={newVal => this.handleQuantityChange(newVal)}
                />
              }
            />
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
      rawId
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

CartProduct.contextTypes = {
  environment: PropTypes.object.isRequired,
};
