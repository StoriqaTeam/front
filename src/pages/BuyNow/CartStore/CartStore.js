// @flow strict

import React, { PureComponent } from 'react';
import { Link } from 'found';

import { Input, Button, Rating } from 'components/common';
import { Icon } from 'components/Icon';
import { withShowAlert } from 'components/App/AlertContext';
import { Container, Row, Col } from 'layout';
import { formatPrice, getNameText, currentCurrency, convertSrc } from 'utils';

import type { AvailableDeliveryPackageType } from 'pages/Checkout/CheckoutContent/DeliveryCompaniesSelect/DeliveryCompaniesSelect.utils';

import CartProduct from './CartProduct';
import type { CalculateBuyNowType } from '../BuyNow';

import './CartStore.scss';

export type ProductType = {
  id: string,
  rawId: number,
  additionalPhotos: Array<string>,
  attributes: Array<{
    attribute: {
      id: string,
      metaField: {
        uiElement: string,
        values: Array<string>,
      },
      name: Array<{
        text: string,
        lang: string,
      }>,
    },
    metaField: ?string,
    value: string,
  }>,
  cashback: ?number,
  discount: ?number,
  photoMain: ?string,
  preOrder: boolean,
  preOrderDays: number,
  price: number,
  quantity: number,
};

type PropsType = {
  baseProductId: number,
  product: ProductType,
  productName: string,
  store: {
    rawId: number,
    logo: ?string,
    name: Array<{
      text: string,
      lang: string,
    }>,
    rating: number,
  },
  buyNowData: CalculateBuyNowType,
  onChangeCount: (quantity: number) => void,
  couponCodeValue: string,
  couponCodeButtonDisabled: boolean,
  isLoadingCouponButton: boolean,
  handleChangeCoupon: (e: SyntheticInputEvent<HTMLInputElement>) => void,
  handleSetCoupon: () => void,
  onDeleteProduct: () => void,
  country: string,
  isShippingAvailable: boolean,
  onChangeDelivery: (pkg: ?AvailableDeliveryPackageType) => Promise<boolean>,
  deliveryPackage: ?AvailableDeliveryPackageType,
};

class CartStore extends PureComponent<PropsType> {
  render() {
    const {
      product,
      productName,
      store,
      buyNowData,
      onChangeCount,
      couponCodeValue,
      couponCodeButtonDisabled,
      isLoadingCouponButton,
      handleChangeCoupon,
      handleSetCoupon,
      onDeleteProduct,
      baseProductId,
      country,
      isShippingAvailable,
      onChangeDelivery,
      deliveryPackage,
    } = this.props;
    return (
      <div styleName="container">
        <div>
          <CartProduct
            baseProductId={baseProductId}
            product={product}
            productName={productName}
            buyNowData={buyNowData}
            onChangeCount={onChangeCount}
            onDeleteProduct={onDeleteProduct}
            country={country}
            isShippingAvailable={isShippingAvailable}
            onChangeDelivery={onChangeDelivery}
            deliveryPackage={deliveryPackage}
          />
        </div>
        <div styleName="footer">
          <Container correct>
            <Row alignItems="center">
              <Col size={12} sm={3}>
                <div styleName="storeInfo">
                  <Link to={`/store/${store.rawId}`}>
                    {store.logo !== '' && store.logo !== null ? (
                      <img
                        src={convertSrc(store.logo, 'small')}
                        alt="store_picture"
                        styleName="image"
                      />
                    ) : (
                      <div styleName="noLogo">
                        <Icon type="camera" size={28} />
                      </div>
                    )}
                    <div styleName="store-description">
                      <div styleName="store-name">
                        {getNameText(store.name, 'EN')}
                      </div>
                      <Rating value={store.rating} />
                    </div>
                  </Link>
                </div>
              </Col>
              <Col size={12} sm={6}>
                <div styleName="coupon">
                  <div styleName="couponIcon">
                    <Icon type="coupon" size={28} />
                  </div>
                  <div styleName="couponInput">
                    <Input
                      id="couponInput"
                      inline
                      fullWidth
                      value={couponCodeValue}
                      onChange={handleChangeCoupon}
                    />
                  </div>
                  <div styleName="couponButton">
                    <Button
                      small
                      disabled={couponCodeButtonDisabled}
                      onClick={handleSetCoupon}
                      isLoading={isLoadingCouponButton}
                      dataTest="couponButton"
                    >
                      Apply code
                    </Button>
                  </div>
                </div>
              </Col>
              <Col size={12} sm={3}>
                <div styleName="storeTotal">
                  <div styleName="storeTotalWrapper">
                    <div styleName="label">Subtotal</div>
                    {Boolean(buyNowData.couponsDiscounts) && (
                      <div styleName="value">
                        <thin styleName="through">
                          {formatPrice(
                            buyNowData.totalCostWithoutDiscounts || 0,
                          )}{' '}
                          {currentCurrency()}
                        </thin>
                      </div>
                    )}
                    <div styleName="value">
                      {formatPrice(buyNowData.totalCost || 0)}{' '}
                      {currentCurrency()}
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    );
  }
}

export default withShowAlert(CartStore);
