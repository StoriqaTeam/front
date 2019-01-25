// @flow strict

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withShowAlert } from 'components/Alerts/AlertContext';
import { Icon } from 'components/Icon';
import { Container, Col, Row } from 'layout';
import { convertSrc } from 'utils';

import type { AvailableDeliveryPackageType } from 'relay/queries/fetchAvailableShippingForUser';
import type { AllCurrenciesType } from 'types';

import ProductInfo from './ProductInfo';

import type { CalculateBuyNowType } from '../BuyNow';
import type { ProductType } from './CartStore';

import './CartProduct.scss';

type StateType = {
  comment: string,
};

type PropsType = {
  product: ProductType,
  productName: string,
  buyNowData: CalculateBuyNowType,
  onChangeCount: (quantity: number) => void,
  onDeleteProduct: () => void,
  country: string,
  isShippingAvailable: boolean,
  baseProductId: number,
  onChangeDelivery: (pkg: ?AvailableDeliveryPackageType) => Promise<boolean>,
  deliveryPackage: ?AvailableDeliveryPackageType,
  onPackagesFetched: (packages: Array<AvailableDeliveryPackageType>) => void,
  currency: AllCurrenciesType,
};

class CartProduct extends Component<PropsType, StateType> {
  state = {
    comment: '',
  };

  render() {
    const {
      product,
      productName,
      buyNowData,
      onChangeCount,
      onDeleteProduct,
      country,
      isShippingAvailable,
      baseProductId,
      onChangeDelivery,
      deliveryPackage,
      onPackagesFetched,
      currency,
    } = this.props;
    if (!product) return null;
    const { photoMain } = product;
    return (
      <div styleName="container">
        <Container correct>
          <Row>
            <Col size={12} sm={3}>
              <Row>
                <Col size={4} sm={12}>
                  <div styleName="left-container">
                    {photoMain != null ? (
                      <div
                        styleName="picture"
                        style={{
                          backgroundImage: `url(${convertSrc(
                            photoMain,
                            'medium',
                          )})`,
                        }}
                      />
                    ) : (
                      <div styleName="noLogo">
                        <Icon type="camera" size={40} />
                      </div>
                    )}
                  </div>
                </Col>
                <Col size={6} smHidden>
                  <div styleName="product-summary-header">{productName}</div>
                </Col>
                <Col size={2} smHidden>
                  <div styleName="recycleContainer">
                    <button
                      styleName="recycle"
                      onClick={onDeleteProduct}
                      data-test="cartProductDeleteButton"
                    >
                      <Icon type="basket" size={32} />
                    </button>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col size={12} sm={9}>
              <Row withoutGrow>
                <Col size={10} sm={11} hidden smVisible>
                  <div styleName="product-summary-header">{productName}</div>
                </Col>
                <Col size={2} sm={1} hidden smVisible>
                  <div styleName="recycleContainer">
                    <button
                      styleName="recycle"
                      onClick={onDeleteProduct}
                      data-test="cartProductDeleteButton"
                    >
                      <Icon type="basket" size={32} />
                    </button>
                  </div>
                </Col>
                <Col size={12}>
                  <div styleName="productInfoWrapper">
                    <ProductInfo
                      product={product}
                      comment={this.state.comment}
                      buyNowData={buyNowData}
                      onChangeCount={onChangeCount}
                      country={country}
                      isShippingAvailable={isShippingAvailable}
                      baseProductId={baseProductId}
                      onChangeDelivery={onChangeDelivery}
                      deliveryPackage={deliveryPackage}
                      onPackagesFetched={onPackagesFetched}
                      currency={currency}
                    />
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default withShowAlert(CartProduct);

CartProduct.contextTypes = {
  environment: PropTypes.object.isRequired,
};
