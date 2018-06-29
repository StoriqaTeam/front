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
import { Col, Row } from 'layout';
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
  unselectable: ?boolean,
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
    const { product, unselectable } = this.props;
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
        <Row>
          <Col size={2}>
            <div styleName="left-container">
              {!unselectable && (
                <div styleName="checkbox">
                  <Checkbox
                    id={`Cartproduct_${product.rawId}`}
                    label={false}
                    isChecked={selected}
                    onChange={() => this.handleSelectChange()}
                  />
                </div>
              )}
              <div styleName="picture" style={{ backgroundImage: `url(${photoMain})`}}>
                {/* <img src={photoMain} styleName="picture" alt="product_picture" /> */}
              </div>
            </div>
          </Col>
          <Col size={10}>
            <Row withoutGrow>
              <Col size={9}>
                <div styleName="product-summary-header">{name}</div>

                <ShowMore height={400} dataTest={`cart-product-${product.rawId}-showMore`}>
                  <Row>
                    <Col size={9}>
                      <div styleName="contentBlock">

                        {attrs.length > 0 &&
                          <div styleName="product-summary-attributes">
                            <div styleName="cart-product-title">About product</div>
                            {attrs.map((attr, idx) => (
                              <div key={idx} styleName="half-width">
                                <CartProductAttribute {...attr} />
                              </div>
                            ))}
                          </div>
                        }

                        <div styleName="delivery-container">
                          <div styleName="cart-product-title">Delivery and return</div>
                          <div styleName="half-width">
                            <CartProductAttribute
                              title="Shiping to"
                              value={
                                <Select
                                  items={[
                                    { id: 1, label: 'Everywhere' },
                                  ]}
                                  activeItem={{ id: 1, label: 'Everywhere' }}
                                  forForm
                                  containerStyle={{ width: '24rem' }}
                                />
                              }
                            />
                          </div>
                          <div styleName="half-width">
                            <CartProductAttribute title="Terms" value="14 days" />
                          </div>
                          <div styleName="half-width">
                            <CartProductAttribute
                              title="Return tyoe on return"
                              value="Exchange or funds return"
                            />
                          </div>
                          <div styleName="half-width">
                            <CartProductAttribute
                              title="Delivery on return"
                              value="Seller pays"
                            />
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col size={3}>

                      {/* <div styleName="product-params"> */}
                      <div styleName="contentBlock">
                        <div styleName="cart-product-title">Price</div>
                        <CartProductAttribute
                          title="Count"
                          value={
                            <Stepper
                              value={quantity}
                              min={0}
                              max={9999}
                              onChange={newVal => this.handleQuantityChange(newVal)}
                            />
                          }
                        />
                        <CartProductAttribute
                          title="Subtotal"
                          value={`${formatPrice(quantity * price || 0)} STQ`}
                        />
                        <CartProductAttribute
                          title="Delivery"
                          value={`${formatPrice(deliveryCost || 0)} STQ`}
                        />
                      </div>
                    </Col>
                  </Row>
                </ShowMore>

              </Col>
              <Col size={3}>
                <div styleName="recycleContainer">
                  <button
                    styleName="recycle"
                    onClick={() => this.handleDelete()}
                    data-test="cartProductDeleteButton"
                  >
                    <Icon type="basket" size={32} />
                  </button>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
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
