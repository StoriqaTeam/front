// @flow strict

import React, { PureComponent, Fragment } from 'react';
import { find, map, whereEq, propOr } from 'ramda';

import { AppContext } from 'components/App';
import Stepper from 'components/Stepper';
import { Container, Col, Row } from 'layout';
import { DeliveryCompaniesSelect } from 'pages/Checkout/CheckoutContent/DeliveryCompaniesSelect';
import {
  formatPrice,
  getNameText,
  convertCountries,
  checkCurrencyType,
} from 'utils';
import type { AvailableDeliveryPackageType } from 'relay/queries/fetchAvailableShippingForUser';
import type { AllCurrenciesType } from 'types';

import CartProductAttribute from './CartProductAttribute';

import type { CalculateBuyNowType } from '../BuyNow';
import type { ProductType } from './CartStore';

import './ProductInfo.scss';

type PropsType = {
  product: ProductType,
  // comment: string,
  buyNowData: CalculateBuyNowType,
  onChangeCount: (quantity: number) => void,
  withDeliveryCompaniesSelect?: boolean,
  country: string,
  isShippingAvailable: boolean,
  baseProductId: number,
  onChangeDelivery: (pkg: ?AvailableDeliveryPackageType) => Promise<boolean>,
  deliveryPackage: ?AvailableDeliveryPackageType,
  onPackagesFetched: (packages: Array<AvailableDeliveryPackageType>) => void,
  currency: AllCurrenciesType,
};

class ProductInfo extends PureComponent<PropsType> {
  static defaultProps = {
    withDeliveryCompaniesSelect: false,
  };

  render() {
    const {
      product,
      buyNowData,
      onChangeCount,
      country,
      isShippingAvailable,
      baseProductId,
      deliveryPackage,
      onChangeDelivery,
      onPackagesFetched,
      currency,
    } = this.props;

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
                        max={product.preOrder ? 999 : product.quantity}
                        onChange={onChangeCount}
                      />
                    }
                  />
                  <CartProductAttribute
                    title="Price"
                    value={`${formatPrice(
                      buyNowData.subtotalWithoutDiscounts || 0,
                      checkCurrencyType(currency) === 'fiat' ? 2 : undefined,
                    )} ${currency || ''}`}
                  />
                  <CartProductAttribute
                    title="Delivery"
                    value={`${formatPrice(
                      buyNowData.deliveryCost || 0,
                      checkCurrencyType(currency) === 'fiat' ? 2 : undefined,
                    )} ${currency || ''}`}
                  />
                  {buyNowData.couponsDiscounts !== 0 && (
                    <CartProductAttribute
                      title="Coupon discount"
                      value={`${formatPrice(
                        buyNowData.couponsDiscounts || 0,
                        checkCurrencyType(currency) === 'fiat' ? 2 : undefined,
                      )} ${currency || ''}`}
                    />
                  )}
                </div>
              </Col>
              <Col size={12}>
                <div styleName="contentBlock">
                  <div>
                    {!isShippingAvailable && (
                      <Fragment>
                        <div styleName="cartProductTitle">Delivery</div>
                        <Row>
                          <Col size={11}>
                            <div styleName="noDeliveryAvailableAlert">
                              <span styleName="error">Attention!</span>&nbsp;No
                              shipping available for this product to your
                              region.
                            </div>
                          </Col>
                        </Row>
                      </Fragment>
                    )}
                    {isShippingAvailable && (
                      <AppContext.Consumer>
                        {({ directories }) => {
                          const currentAddressCountry = find(
                            whereEq({ label: country }),
                            convertCountries(directories.countries),
                          );
                          // $FlowIgnoreMe
                          const currentCountryAlpha3 = propOr(
                            null,
                            'alpha3',
                            currentAddressCountry,
                          );

                          return currentCountryAlpha3 != null ? (
                            <Fragment>
                              <div styleName="cartProductTitle">Delivery</div>
                              {
                                <Row>
                                  <Col size={11}>
                                    <DeliveryCompaniesSelect
                                      currency={currency}
                                      baseProductId={baseProductId}
                                      // $FlowIgnoreMe
                                      country={currentCountryAlpha3}
                                      onPackagesFetched={onPackagesFetched}
                                      onPackageSelect={onChangeDelivery}
                                      selectedCompanyShippingRawId={
                                        deliveryPackage
                                          ? deliveryPackage.shippingId
                                          : null
                                      }
                                    />
                                  </Col>
                                </Row>
                              }
                            </Fragment>
                          ) : (
                            <span>No country found</span>
                          );
                        }}
                      </AppContext.Consumer>
                    )}
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
                    max={product.preOrder ? 999 : product.quantity}
                    onChange={onChangeCount}
                  />
                }
              />
              <CartProductAttribute
                title="Price"
                value={`${formatPrice(
                  buyNowData.subtotal || 0,
                  checkCurrencyType(currency) === 'fiat' ? 2 : undefined,
                )} ${currency || ''}`}
              />
              <CartProductAttribute
                title="Delivery"
                value={`${formatPrice(
                  buyNowData.deliveryCost || 0,
                  checkCurrencyType(currency) === 'fiat' ? 2 : undefined,
                )} ${currency || ''}`}
              />
              {buyNowData.couponsDiscounts !== 0 && (
                <CartProductAttribute
                  title="Coupon discount"
                  value={`−${formatPrice(
                    buyNowData.couponsDiscounts || 0,
                    checkCurrencyType(currency) === 'fiat' ? 2 : undefined,
                  )} ${currency || ''}`}
                />
              )}
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default ProductInfo;
