// @flow

import React, { PureComponent } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { pipe, path, pathOr, map, head, defaultTo } from 'ramda';
import PropTypes from 'prop-types';

import { withShowAlert } from 'components/App/AlertContext';
import { Checkbox } from 'components/Checkbox';
import ShowMore from 'components/ShowMore';
import Stepper from 'components/Stepper';
import { Icon } from 'components/Icon';
import { Select } from 'components/common/Select';
import {
  SetQuantityInCartMutation,
  SetSelectionInCartMutation,
  DeleteFromCartMutation,
} from 'relay/mutations';
import { log, formatPrice } from 'utils';

import type { AddAlertInputType } from 'components/App/AlertContext';

import CartProductAttribute from './CartProductAttribute';

// eslint-disable-next-line
import type CartProduct_product from './__generated__/CartProduct_product.graphql';

import './CartProduct.scss';

type PropsType = {
  showAlert: (input: AddAlertInputType) => void,
  // eslint-disable-next-line
  ...CartProduct_product,
};

/* eslint-disable react/no-array-index-key */
class CartProduct extends PureComponent<PropsType> {
  handleDelete() {
    const id = this.props.product.rawId;
    DeleteFromCartMutation.commit({
      input: { clientMutationId: '', productId: id },
      environment: this.context.environment,
      onCompleted: (response, errors) => {
        log.debug('Success for DeleteFromCart mutation');
        if (response) {
          log.debug('Response: ', response);
        }
        if (errors) {
          log.debug('Errors: ', errors);
        }
      },
      onError: error => {
        log.error('Error in DeleteFromCart mutation');
        log.error(error);
        this.props.showAlert({
          type: 'danger',
          text: 'Unable to delete product quantity in cart',
          link: { text: 'Close.' },
        });
      },
    });
  }

  handleSelectChange() {
    const { rawId: productId, id: nodeId } = this.props.product;
    SetSelectionInCartMutation.commit({
      input: {
        clientMutationId: '',
        productId,
        value: !this.props.product.selected,
      },
      nodeId,
      environment: this.context.environment,
      onCompleted: (response, errors) => {
        log.debug('Success for SetSelectionInCart mutation');
        if (response) {
          log.debug('Response: ', response);
        }
        if (errors) {
          log.debug('Errors: ', errors);
        }
      },
      onError: error => {
        log.error('Error in SetSelectionInCart mutation');
        log.error(error);
        this.props.showAlert({
          type: 'danger',
          text: 'Unable to set product selection in cart',
          link: { text: 'Close.' },
        });
      },
    });
  }

  handleQuantityChange(newVal) {
    const { rawId: productId, id: nodeId } = this.props.product;
    SetQuantityInCartMutation.commit({
      input: { clientMutationId: '', productId, value: newVal },
      nodeId,
      environment: this.context.environment,
      onCompleted: (response, errors) => {
        log.debug('Success for SetQuantityInCart mutation');
        if (response) {
          log.debug('Response: ', response);
        }
        if (errors) {
          log.debug('Errors: ', errors);
        }
      },
      onError: error => {
        log.error('Error in SetQuantityInCart mutation');
        log.error(error);
        this.props.showAlert({
          type: 'danger',
          text: 'Unable to set product quantity in cart',
          link: { text: 'Close.' },
        });
      },
    });
  }

  render() {
    const { product } = this.props;
    if (!product) return null;
    const name: ?string = pipe(
      pathOr([], ['name']),
      head,
      defaultTo({}),
      path(['text']),
    )(product);
    const {
      photoMain,
      attributes,
      price,
      quantity,
      deliveryCost,
      selected,
    } = product;
    const attrs = map(attr => ({
      title: head(attr.attribute.name).text,
      value: attr.value.toString(),
    }))(attributes);

    return (
      <div styleName="container">
        <button
          styleName="recycle"
          onClick={() => this.handleDelete()}
          data-test="cartProductDeleteButton"
        >
          <Icon type="basket" size={32} />
        </button>
        <div styleName="left-container">
          <div styleName="checkbox">
            <Checkbox
              id={`Cartproduct_${product.rawId}`}
              label={false}
              isChecked={selected}
              onChange={() => this.handleSelectChange()}
            />
          </div>
          <img src={photoMain} styleName="picture" alt="product_picture" />
        </div>
        <div styleName="main-container">
          <div styleName="product-summary">
            <div styleName="product-summary-header">{name}</div>
            <div styleName="product-summary-attributes">
              <div styleName="cart-product-title">Attributes</div>
              {attrs.map((attr, idx) => (
                <div key={idx} styleName="half-width">
                  <CartProductAttribute {...attr} />
                </div>
              ))}
            </div>
            <ShowMore dataTest={`cart-product-${product.rawId}-showMore`}>
              <div styleName="delivery-container">
                <div styleName="cart-product-title">Delivery and return</div>
                <div styleName="half-width">
                  <CartProductAttribute
                    title="Delivery"
                    value={
                      <Select
                        items={[
                          { id: 1, label: 'DHL' },
                          { id: 2, label: 'Boxberry' },
                        ]}
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
                  <CartProductAttribute
                    title="Return policy"
                    value="Replacement or cash"
                  />
                </div>
                <div styleName="half-width">
                  <CartProductAttribute
                    title="Delivery return terms"
                    value="Paid by seller"
                  />
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
                  dataTest={`product-${product.rawId}-quantity-stepper`}
                  value={quantity}
                  min={0}
                  max={9999}
                  onChange={newVal => this.handleQuantityChange(newVal)}
                />
              }
            />
            <CartProductAttribute
              title="Total cost"
              value={`${formatPrice(quantity * price || 0)} STQ`}
            />
            <CartProductAttribute
              title="Delivery cost"
              value={`${formatPrice(deliveryCost || 0)} STQ`}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default createFragmentContainer(
  withShowAlert(CartProduct),
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
      selected
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
