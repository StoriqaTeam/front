import React from 'react';
import { head, map } from 'ramda';

import ShowMore from 'components/ShowMore';
import Stepper from 'components/Stepper';
import { Input } from 'components/common/Input';
import { Select } from 'components/common/Select';
import { Container, Col, Row } from 'layout';
import { formatPrice } from 'utils';

import CartProductAttribute from './CartProductAttribute';

import './ProductInfo.scss';

const ProductInfo = ({
  product,
  onQuantityChange,
  onChangeComment,
  comment,
}) => {
  const attrs = map(attr => ({
    title: head(attr.attribute.name).text,
    value: attr.value.toString(),
  }))(product.attributes);
  return (
    <ShowMore height={400} dataTest={`cart-product-${product.rawId}-showMore`}>
      <Container correct>
        <Row>
          <Col size={9}>
            <div styleName="contentBlock">
              {attrs.length > 0 && (
                <div styleName="product-summary-attributes">
                  <div styleName="cart-product-title">About product</div>
                  {attrs.map((attr, idx) => (
                    <div key={idx} styleName="half-width">
                      <CartProductAttribute {...attr} />
                    </div>
                  ))}
                </div>
              )}

              <div>
                <div styleName="cart-product-title">Delivery and return</div>
                <div styleName="half-width">
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
          <Col size={3}>
            {/* <div styleName="product-params"> */}
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
