// @flow

import React, { PureComponent, Fragment } from 'react';
import { head, map, find, whereEq, propOr, pathOr } from 'ramda';

import ShowMore from 'components/ShowMore';
import Stepper from 'components/Stepper';
import { Input } from 'components/common/Input';
import { Container, Col, Row } from 'layout';
import { formatPrice, currentCurrency, convertCountries, log } from 'utils';
import { AppContext } from 'components/App';

import CartProductAttribute from './CartProductAttribute';
import { DeliveryCompaniesSelect } from '../Checkout/CheckoutContent/DeliveryCompaniesSelect';
import CheckoutContext from '../Checkout/CheckoutContext';

// eslint-disable-next-line
import type CartProduct_product from './__generated__/CartProduct_product.graphql';
import type { AvailableDeliveryPackageType } from '../Checkout/CheckoutContent/DeliveryCompaniesSelect/DeliveryCompaniesSelect.utils';

import './ProductInfo.scss';

type PropsType = {
  onQuantityChange: Function,
  onChangeComment: Function,
  comment: string,
  // eslint-disable-next-line
  ...CartProduct_product,
  withDeliveryCompaniesSelect?: boolean,
};

class ProductInfo extends PureComponent<PropsType> {
  static defaultProps = {
    withDeliveryCompaniesSelect: false,
  };

  handlePackageSelect = (pkg: ?AvailableDeliveryPackageType) => {
    log.debug('ProductInfo.handlePackageSelect', { pkg });
  };

  render() {
    const {
      product,
      onQuantityChange,
      onChangeComment,
      comment,
      withDeliveryCompaniesSelect,
    } = this.props;

    const attrs = map(
      attr => ({
        title: head(attr.attribute.name).text,
        value: attr.value.toString(),
      }),
      product.attributes,
    );

    const isShippingAvailable = pathOr(
      false,
      ['baseProduct', 'isShippingAvailable'],
      product,
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
                      {withDeliveryCompaniesSelect === false &&
                        !isShippingAvailable && (
                          <Fragment>
                            <div styleName="cart-product-title">Delivery</div>
                            <Row>
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
                            </Row>
                          </Fragment>
                        )}
                      {withDeliveryCompaniesSelect && (
                        <AppContext.Consumer>
                          {({ directories }) => (
                            <CheckoutContext.Consumer>
                              {({ country }) => {
                                // $FlowIgnoreMe
                                const currentAddressCountry = find(
                                  whereEq({ label: country }),
                                  convertCountries(directories.countries),
                                );
                                const currentCountryAlpha3 = propOr(
                                  null,
                                  'alpha3',
                                  currentAddressCountry,
                                );

                                return currentCountryAlpha3 != null ? (
                                  <Fragment>
                                    <div styleName="cart-product-title">
                                      Delivery
                                    </div>
                                    <Row>
                                      <Col size={11}>
                                        <DeliveryCompaniesSelect
                                          baseProductId={product.baseProductId}
                                          country={currentCountryAlpha3}
                                          onPackagesFetched={() => {}}
                                          onPackageSelect={
                                            this.handlePackageSelect
                                          }
                                        />
                                      </Col>
                                    </Row>
                                  </Fragment>
                                ) : (
                                  <span>No country found</span>
                                );
                              }}
                            </CheckoutContext.Consumer>
                          )}
                        </AppContext.Consumer>
                      )}
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
          </Row>
        </Container>
      </ShowMore>
    );
  }
}

export default ProductInfo;
