import React from 'react';
import { head, map } from 'ramda';

import ShowMore from 'components/ShowMore';
import Stepper from 'components/Stepper';
import { Input } from 'components/common/Input';
import { Select } from 'components/common/Select';
import { Container, Col, Row } from 'layout';
import { formatPrice } from 'utils';

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
};

const ProductInfo = ({
  product,
  onQuantityChange,
  onChangeComment,
  comment,
}: PropsType) => {
  const attrs = map(attr => ({
    title: head(attr.attribute.name).text,
    value: attr.value.toString(),
  }))(product.attributes);
  return (
    <ShowMore
      initialState
      height={400}
      dataTest={`cart-product-${product.rawId}-showMore`}
    >
      <Container correct>
        <Row>
          <Col size={12} xl={8}>
            <Row>
              <Col size={6} xl={12}>
                <div styleName="contentBlock">
                  {attrs.length > 0 && (
                    <div styleName="product-summary-attributes">
                      <div styleName="cart-product-title">About product</div>
                      <Row>
                        {attrs.map(attr => (
                          <Col key={`attr-${attr.value}`} size={12} xl={6}>
                            <CartProductAttribute {...attr} />
                          </Col>
                        ))}
                      </Row>
                    </div>
                  )}
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
                    )} STQ`}
                  />
                  <CartProductAttribute
                    title="Delivery"
                    value={`${formatPrice(product.deliveryCost || 0)} STQ`}
                  />
                </div>
              </Col>
              <Col size={12}>
                <div styleName="contentBlock">
                  <div>
                    <div styleName="cart-product-title">
                      Delivery and return
                    </div>
                    <Row>
                      <Col size={6}>
                        <CartProductAttribute
                          title="Shiping to"
                          value={
                            <Select
                              items={[{ id: 1, label: 'Everywhere' }]}
                              activeItem={{ id: 1, label: 'Everywhere' }}
                              forForm
                              containerStyle={{ width: '24rem' }}
                            />
                          }
                        />
                      </Col>
                      <Col size={6}>
                        <CartProductAttribute title="Terms" value="14 days" />
                      </Col>
                      <Col size={6}>
                        <CartProductAttribute
                          title="Return tyoe on return"
                          value="Exchange or funds return"
                        />
                      </Col>
                      <Col size={6}>
                        <CartProductAttribute
                          title="Delivery on return"
                          value="Seller pays"
                        />
                      </Col>
                    </Row>
                    <div styleName="comment">
                      <div styleName="title">Customer comment</div>
                      <Input
                        fullWidth
                        id="customerComment"
                        onChange={onChangeComment}
                        value={comment}
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
                )} STQ`}
              />
              <CartProductAttribute
                title="Delivery"
                value={`${formatPrice(product.deliveryCost || 0)} STQ`}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </ShowMore>
  );
};

export default ProductInfo;
