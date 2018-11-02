// @flow strict

import React from 'react';
import { map } from 'ramda';

import Stepper from 'components/Stepper';
import { Container, Col, Row } from 'layout';
import { formatPrice, currentCurrency, getNameText } from 'utils';

import CartProductAttribute from './CartProductAttribute';

import type { CalculateBuyNowType } from '../BuyNow';
import type { ProductType } from './CartStore';

import './ProductInfo.scss';

type PropsType = {
  product: ProductType,
  // comment: string,
  buyNowData: CalculateBuyNowType,
  onChangeCount: (quantity: number) => void,
};

const ProductInfo = ({ product, buyNowData, onChangeCount }: PropsType) => {
  const attrs = map(
    attr => ({
      title: getNameText(attr.attribute.name, 'EN'),
      value: attr.value.toString(),
    }),
    product.attributes,
  );
  return (
    <Container correct>
      <Row>
        <Col size={12} xl={8}>
          <Row>
            <Col size={6} xl={12}>
              <div styleName="contentBlock">
                <div styleName="product-summary-attributes">
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
                      value={buyNowData.totalCount}
                      min={0}
                      max={product.quantity}
                      onChange={onChangeCount}
                    />
                  }
                />
                <CartProductAttribute
                  title="Subtotal"
                  value={`${formatPrice(
                    buyNowData.totalCost || 0,
                  )} ${currentCurrency()}`}
                />
                <CartProductAttribute
                  title="Delivery"
                  value={`${formatPrice(
                    buyNowData.deliveryCost || 0,
                  )} ${currentCurrency()}`}
                />
                {buyNowData.couponsDiscounts !== 0 && (
                  <CartProductAttribute
                    title="Coupon discount"
                    value={`${formatPrice(
                      buyNowData.couponsDiscounts || 0,
                    )} ${currentCurrency()}`}
                  />
                )}
              </div>
            </Col>
            <Col size={12}>
              <div styleName="contentBlock">
                <div>
                  <div styleName="comment">
                    {/* <Input
                      fullWidth
                      id="customerComment"
                      onChange={onChangeComment}
                      value={comment}
                      label="Customer comment"
                    /> */}
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
                  value={buyNowData.totalCount}
                  min={0}
                  max={product.quantity}
                  onChange={onChangeCount}
                />
              }
            />
            <CartProductAttribute
              title="Subtotal"
              value={`${formatPrice(
                buyNowData.totalCost || 0,
              )} ${currentCurrency()}`}
            />
            <CartProductAttribute
              title="Delivery"
              value={`${formatPrice(
                buyNowData.deliveryCost || 0,
              )} ${currentCurrency()}`}
            />
            {buyNowData.couponsDiscounts !== 0 && (
              <CartProductAttribute
                title="Coupon discount"
                value={`${formatPrice(
                  buyNowData.couponsDiscounts || 0,
                )} ${currentCurrency()}`}
              />
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductInfo;
