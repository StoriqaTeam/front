import React from 'react';
import { head, map } from 'ramda';

import ShowMore from 'components/ShowMore';
import Stepper from 'components/Stepper';
import { Input } from 'components/common/Input';
// import { Select } from 'components/common/Select';
import { Container, Col, Row } from 'layout';
import { formatPrice, currentCurrency } from 'utils';

import CartProductAttribute from './CartProductAttribute';

// eslint-disable-next-line
import type CartProduct_product from './__generated__/CartProduct_product.graphql';
import type { CalculateBuyNow } from '../BuyNow';

import './ProductInfo.scss';

type PropsType = {
  buyNowData: {},
  onQuantityChange: Function,
  onChangeComment: Function,
  comment: string,
  // eslint-disable-next-line
  ...CartProduct_product,
  buyNowData: CalculateBuyNow,
  onChangeCount: (quantity: number) => void,
};

const ProductInfo = ({
  product,
  onQuantityChange,
  onChangeComment,
  comment,
  isOpen,
  buyNowData,
  onChangeCount,
}: PropsType) => {
  //
  const attrs = map(attr => ({
    title: head(attr.attribute.name).text,
    value: attr.value.toString(),
  }))(product.attributes);
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
                      value={product.quantity}
                      min={0}
                      max={9999}
                      onChange={onChangeCount}
                    />
                  }
                />
                <CartProductAttribute
                  title="Subtotal"
                  value={`${formatPrice(
                    product.subtotal || 0,
                  )} ${currentCurrency()}`}
                />
                <CartProductAttribute
                  title="Delivery"
                  value={`${formatPrice(
                    product.deliveryCost || 0,
                  )} ${currentCurrency()}`}
                />
                {product.couponDiscount !== 0 && (
                  <CartProductAttribute
                    title="Coupon discount"
                    value={`${formatPrice(
                      product.couponDiscount || 0,
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
                  max={9999}
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
