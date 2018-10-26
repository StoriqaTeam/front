import React from 'react';
import { head, map } from 'ramda';

import { CurrencyPrice } from 'components/common';
import ShowMore from 'components/ShowMore';
import Stepper from 'components/Stepper';
import { Input } from 'components/common/Input';
// import { Select } from 'components/common/Select';
import { Container, Col, Row } from 'layout';
import { formatPrice, currentCurrency } from 'utils';

import CartProductAttribute from '../CartProductAttribute';

// eslint-disable-next-line
import type CartProduct_product from 'pages/Cart/CartProduct/__generated__/CartProduct_product.graphql';

import './ProductInfo.scss';

import t from './i18n';

type PropsType = {
  onQuantityChange: Function,
  onChangeComment: Function,
  comment: string,
  // eslint-disable-next-line
  ...CartProduct_product,
  priceUsd: ?number,
};

const ProductInfo = ({
  product,
  onQuantityChange,
  onChangeComment,
  comment,
  isOpen,
  priceUsd,
}: PropsType) => {
  const attrs = map(attr => ({
    title: head(attr.attribute.name).text,
    value: attr.value.toString(),
  }))(product.attributes);
  return (
    <ShowMore
      isOpen={isOpen}
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
                    <div styleName="cart-product-title">{t.aboutProduct}</div>
                    {product.preOrder &&
                      product.preOrderDays && (
                        <div styleName="preOrder">
                          <div styleName="preOrderText">
                            <div>{t.availableForPreOrder}</div>
                            <div>
                              {t.leadTime}{' '}
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
                  <div styleName="cart-product-title">{t.price}</div>
                  <CartProductAttribute
                    title={t.count}
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
                    title={t.subtotal}
                    value={`${formatPrice(
                      product.quantity * product.price || 0,
                    )} ${currentCurrency()}`}
                  />
                  <CartProductAttribute
                    title={t.delivery}
                    value={`${formatPrice(
                      product.deliveryCost || 0,
                    )} ${currentCurrency()}`}
                  />
                </div>
              </Col>
              <Col size={12}>
                <div styleName="contentBlock">
                  <div>
                    {/* <div styleName="cart-product-title">
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
                              fullWidth
                              onSelect={() => {}}
                            />
                          }
                        />
                      </Col>
                      <Col size={6}>
                        <CartProductAttribute title="Terms" value="14 days" />
                      </Col>
                      <Col size={6}>
                        <CartProductAttribute
                          title="Return type on return"
                          value="Exchange or funds return"
                        />
                      </Col>
                      <Col size={6}>
                        <CartProductAttribute
                          title="Delivery on return"
                          value="Seller pays"
                        />
                      </Col>
                    </Row> */}
                    <div styleName="comment">
                      <Input
                        fullWidth
                        id="customerComment"
                        onChange={onChangeComment}
                        value={comment}
                        label={t.labelCostumerComment}
                      />
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
          <Col size={4} xlVisibleOnly>
            <div styleName="contentBlock">
              <div styleName="cart-product-title">{t.price}</div>
              <CartProductAttribute
                title={t.count}
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
                title={t.subtotal}
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
                title={t.delivery}
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
};

export default ProductInfo;
