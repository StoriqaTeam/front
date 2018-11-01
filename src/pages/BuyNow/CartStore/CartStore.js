// @flow

import React, { PureComponent } from 'react';
import { Link } from 'found';

import { Input, Button } from 'components/common';
import { Rating } from 'components/common/Rating';
import { Icon } from 'components/Icon';
import { withShowAlert } from 'components/App/AlertContext';
import { Container, Row, Col } from 'layout';
import {
  formatPrice,
  getNameText,
  currentCurrency,
  convertSrc,
} from 'utils';

import CartProduct from './CartProduct';
import type { CalculateBuyNow } from '../BuyNow';

import './CartStore.scss';

type PropsType = {
  baseProductId: number,
  storeId: number,
  product: any,
  productName: string,
  store: any,
  buyNowData: CalculateBuyNow,
  onChangeCount: (quantity: number) => void,
  couponCodeValue: string,
  couponCodeButtonDisabled: boolean,
  isLoadingCouponButton: boolean,
  handleChangeCoupon: (e: SyntheticInputEvent<HTMLInputElement>) => void,
  handleSetCoupon: () => void,
  onDeleteProduct: () => void,
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
      storeId,
    } = this.props;
    return (
      <div styleName="container">
        <div>
          <CartProduct
            baseProductId={baseProductId}
            storeId={storeId}
            product={product}
            productName={productName}
            buyNowData={buyNowData}
            onChangeCount={onChangeCount}
            onDeleteProduct={onDeleteProduct}
          />
        </div>
        <div styleName="footer">
          <Container correct>
            <Row alignItems="center">
              <Col size={12} sm={3}>
                <div styleName="storeInfo">
                  <Link to={`/store/${store.rawId}`}>
                    {store.logo ? (
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
                          {formatPrice(buyNowData.totalCostWithoutDiscounts || 0)}{' '}
                          {currentCurrency()}
                        </thin>
                      </div>
                    )}
                    <div styleName="value">
                      {formatPrice(buyNowData.totalCost || 0)} {currentCurrency()}
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
