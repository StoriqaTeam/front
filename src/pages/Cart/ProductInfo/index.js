// @flow

import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { head, map, find, whereEq, propOr, pathOr, isNil, is } from 'ramda';

import ShowMore from 'components/ShowMore';
import Stepper from 'components/Stepper';
import { Input } from 'components/common/Input';
import { Container, Col, Row } from 'layout';
import { formatPrice, currentCurrency, convertCountries, log } from 'utils';
import { AppContext } from 'components/App';

import CartProductAttribute from '../CartProductAttribute';
import { DeliveryCompaniesSelect } from '../../Checkout/CheckoutContent/DeliveryCompaniesSelect';
import CheckoutContext from '../../Checkout/CheckoutContext';
import setDeliveryPackageInCartMutation from '../../Checkout/CheckoutContent/DeliveryCompaniesSelect/mutations/SetDeliveryPackageInCart';
import removeDeliveryMethodForProductMutation from '../../Checkout/CheckoutContent/DeliveryCompaniesSelect/mutations/RemoveDeliveryMethodForProduct';

// eslint-disable-next-line
import type CartProduct_product from '../CartProduct/__generated__/CartProduct_product.graphql';
import type { AvailableDeliveryPackageType } from '../../Checkout/CheckoutContent/DeliveryCompaniesSelect/DeliveryCompaniesSelect.utils';

import './ProductInfo.scss';

import t from './i18n';

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

  handlePackageSelect = (
    pkg: ?AvailableDeliveryPackageType,
  ): Promise<boolean> => {
    log.debug('ProductInfo.handlePackageSelect', { pkg });
    log.debug('product', this.props.product);

    const productId = pathOr(null, ['rawId'], this.props.product);
    log.debug({ productId });
    log.debug({
      '!isNil(pkg)': !isNil(pkg),
      '!isNil(productId)': !isNil(productId),
      'is(Number,productId)': is(Number, productId),
    });
    if (!isNil(pkg) && !isNil(productId) && is(Number, productId)) {
      return setDeliveryPackageInCartMutation({
        environment: this.context.environment,
        variables: {
          input: {
            clientMutationId: '',
            productId: parseInt(productId, 10),
            companyPackageId: pkg.companyPackageRawId,
            shippingId: pkg.shippingId,
          },
        },
      })
        .then(response => {
          log.debug('mutation response', { response });
          return Promise.resolve(true);
        })
        .catch(err => Promise.reject(err));
    }
    return Promise.resolve(true);
  };

  handlePackageFetching = (packages: Array<AvailableDeliveryPackageType>) => {
    const shippingId: ?number = pathOr(null)([
      'product',
      'selectPackage',
      'shippingId',
    ])(this.props);
    log.debug('handlePackageFetching', {
      packages,
      selected: shippingId,
    });

    const currentProductRawId: ?number = pathOr(null, ['product', 'rawId'])(
      this.props,
    );

    if (shippingId != null) {
      const isProductPackageExists = !isNil(
        find(whereEq({ shippingId }), packages),
      );
      if (!isProductPackageExists && currentProductRawId) {
        removeDeliveryMethodForProductMutation({
          environment: this.context.environment,
          variables: {
            input: {
              clientMutationId: '',
              productId: currentProductRawId,
            },
          },
        });
      }
    }
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
                      title={t.price}
                      value={`${formatPrice(
                        product.subtotalWithoutDiscounts || 0,
                      )} ${currentCurrency()}`}
                    />
                    <CartProductAttribute
                      title={t.delivery}
                      value={`${formatPrice(
                        product.deliveryCost || 0,
                      )} ${currentCurrency()}`}
                    />
                    {product.couponDiscount !== 0 && (
                      <CartProductAttribute
                        title={t.couponDiscount}
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
                            <div styleName="cart-product-title">
                              {t.delivery}
                            </div>
                            <Row>
                              <Col size={11}>
                                <div styleName="noDeliveryAvailableAlert">
                                  <span styleName="error">{t.attention}</span>&nbsp;{
                                    t.noShippingAvailable
                                  }
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
                                      {t.delivery}
                                    </div>
                                    <Row>
                                      <Col size={11}>
                                        <DeliveryCompaniesSelect
                                          baseProductId={product.baseProductId}
                                          country={currentCountryAlpha3}
                                          onPackagesFetched={
                                            this.handlePackageFetching
                                          }
                                          onPackageSelect={
                                            this.handlePackageSelect
                                          }
                                          // $FlowIgnoreMe
                                          selectedCompanyShippingRawId={pathOr(
                                            null,
                                            ['selectPackage', 'shippingId'],
                                            product,
                                          )}
                                        />
                                      </Col>
                                    </Row>
                                  </Fragment>
                                ) : (
                                  <span>{t.noCountryFound}</span>
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
                  title={t.price}
                  value={`${formatPrice(
                    product.subtotalWithoutDiscounts || 0,
                  )} ${currentCurrency()}`}
                />
                <CartProductAttribute
                  title={t.delivery}
                  value={`${formatPrice(
                    product.deliveryCost || 0,
                  )} ${currentCurrency()}`}
                />
                {product.couponDiscount !== 0 && (
                  <CartProductAttribute
                    title={t.couponDiscount}
                    value={`−${formatPrice(
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

ProductInfo.contextTypes = {
  environment: PropTypes.object.isRequired,
};

export default ProductInfo;
