// @flow

import React, { PureComponent } from 'react';
import { head, map } from 'ramda';

import { CurrencyPrice } from 'components/common';
import ShowMore from 'components/ShowMore';
import Stepper from 'components/Stepper';
import { Input } from 'components/common/Input';
// import { Select } from 'components/common/Select';
import { Container, Col, Row } from 'layout';
import { formatPrice, currentCurrency } from 'utils';

import CartProductAttribute from './CartProductAttribute';

// eslint-disable-next-line
import type CartProduct_product from './__generated__/CartProduct_product.graphql';

import './ProductInfo.scss';

type PropsType = {
  onQuantityChange: Function,
  onChangeComment: Function,
  comment: string,
  // eslint-disable-next-line
  ...CartProduct_product,
  priceUsd: ?number,
  withDeliveryCompaniesSelect?: boolean,
};

class ProductInfo extends PureComponent<PropsType> {
  static defaultProps = {
    withDeliveryCompaniesSelect: false,
  };

  render() {
    const {
      product,
      onQuantityChange,
      onChangeComment,
      comment,
      priceUsd,
      withDeliveryCompaniesSelect,
    } = this.props;
    const attrs = map(
      attr => ({
        title: head(attr.attribute.name).text,
        value: attr.value.toString(),
      }),
      product.attributes,
    );
    return (
      <ShowMore
        isOpen
        height={400}
        dataTest={`cart-product-${product.rawId}-showMore`}
      >
        <Container correct>
          <Row>
            <Col size={12} xl={8}>
              <Row>
                <Col size={6} xl={12}>
                  <div styleName="contentBlock">
                    <div styleName="product-summary-attributes">
                      <div styleName="cart-product-title">About product</div>
                      {product.preOrder &&
                        product.preOrderDays && (
                          <div styleName="preOrder">
                            <div styleName="preOrderText">
                              <div>Available for pre-order.</div>
                              <div>
                                Lead time (days):{' '}
                                <span styleName="preOrderDays">
                                  {product.preOrderDays}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      {(attrs.length > 0 && (
                        <Row>
                          {attrs.map(attr => (
                            <Col key={`attr-${attr.value}`} size={12} xl={6}>
                              <CartProductAttribute {...attr} />
                            </Col>
                          ))}
                        </Row>
                      )) || <div styleName="empty" />}
                    </div>
                  </div>
                </Col>
                <Col size={6} xlHidden>
                  <div styleName="contentBlock">
                    <div styleName="cart-product-title">Price</div>
                    <CartProductAttribute
                      title="Count"
                      value={
                        <Stepper
                          value={product.quantity}
                          min={0}
                          max={9999}
                          onChange={newVal => onQuantityChange(newVal)}
                        />
                      }
                    />
                    <CartProductAttribute
                      title="Subtotal"
                      value={`${formatPrice(
                        product.quantity * product.price || 0,
                      )} ${currentCurrency()}`}
                    />
                    <CartProductAttribute
                      title="Delivery"
                      value={`${formatPrice(
                        product.deliveryCost || 0,
                      )} ${currentCurrency()}`}
                    />
                  </div>
                </Col>
                <Col size={12}>
                  <div styleName="contentBlock">
                    <div>
                      <div styleName="cart-product-title">Delivery</div>
                      <Row>
                        {withDeliveryCompaniesSelect === false && (
                          <Col size={11}>
                            <div styleName="noDeliveryAvailableAlert">
                              <div styleName="icon">
                                {/* eslint-disable */}
                                <img
                                  src={require('./png/attention.png')}
                                  alt="!"
                                />
                                {/* eslint-enable */}
                              </div>
                              <span styleName="error">Attention!</span>&nbsp;No
                              shipping available for this product to your
                              region.
                            </div>
                          </Col>
                        )}
                      </Row>
                      <div styleName="comment">
                        <Input
                          fullWidth
                          id="customerComment"
                          onChange={onChangeComment}
                          value={comment}
                          label="Customer comment"
                        />
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col size={4} xlVisibleOnly>
              <div styleName="contentBlock">
                <div styleName="cart-product-title">Price</div>
                <CartProductAttribute
                  title="Count"
                  value={
                    <Stepper
                      value={product.quantity}
                      min={0}
                      max={9999}
                      onChange={newVal => onQuantityChange(newVal)}
                    />
                  }
                />
                <CartProductAttribute
                  title="Subtotal"
                  value={`${formatPrice(
                    product.quantity * product.price || 0,
                  )} ${currentCurrency()}`}
                />
                {priceUsd && (
                  <CurrencyPrice
                    price={product.quantity * product.price || 0}
                    currencyPrice={priceUsd}
                    currencyCode="USD"
                    toFixedValue={2}
                  />
                )}
                <CartProductAttribute
                  title="Delivery"
                  value={`${formatPrice(
                    product.deliveryCost || 0,
                  )} ${currentCurrency()}`}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </ShowMore>
    );
  }
}

export default ProductInfo;
