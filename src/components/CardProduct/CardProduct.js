// @flow

import React, { PureComponent } from 'react';
import { Link } from 'found';
import { head } from 'ramda';
import classNames from 'classnames';

import { Icon } from 'components/Icon';
import { Rating } from 'components/common/Rating';
import BannerLoading from 'components/Banner/BannerLoading';
import { getNameText } from 'utils';
import ImageLoader from 'libs/react-image-loader';

import { formatPrice } from './utils';

import './CardProduct.scss';

type VariantType = {
  discount: number,
  photoMain: string,
  cashback: number,
  price: number,
};

type PropsTypes = {
  item: {
    rawId: number,
    storeId: number,
    currencyId: number,
    name: Array<{
      lang: string,
      text: string,
    }>,
    variants: Array<VariantType>,
    rating: ?number,
  },
};

class CardProduct extends PureComponent<PropsTypes> {
  render() {
    const {
      item: { rawId, storeId, name, variants, currencyId, rating },
    } = this.props;
    if (
      !storeId ||
      !rawId ||
      !currencyId ||
      !rating ||
      !variants ||
      variants.length === 0 ||
      !head(variants)
    )
      return null;
    const { discount, photoMain, cashback, price } = head(variants);
    const lang = 'EN';
    const productLink = `/store/${storeId}/products/${rawId}`;
    const discountedPrice = price * (1 - discount);
    const discountValue = discount ? (discount * 100).toFixed(0) : null;
    const cashbackValue = cashback ? (cashback * 100).toFixed(0) : null;
    return (
      <div styleName="container">
        <Link to={productLink} styleName="body" data-test={rawId}>
          <div styleName="top">
            {discountValue && (
              <div styleName="discount">
                <b>{`-${discountValue}%`}</b>
              </div>
            )}
            {!photoMain ? (
              <Icon type="camera" size="40" />
            ) : (
              <ImageLoader fit src={photoMain} loader={<BannerLoading />} />
            )}
          </div>
          <div styleName="bottom">
            <div styleName="icon">{false && <Icon type="qa" size="20" />}</div>
            <div>
              <Rating value={rating} />
              {name && (
                <div styleName="title">
                  <strong>{getNameText(name, lang)}</strong>
                </div>
              )}
            </div>
            <div styleName="price">
              {Boolean(discount) && (
                <div styleName="undiscountedPrice">
                  {formatPrice(price)} STQ
                </div>
              )}
              {discountedPrice && (
                <div styleName="actualPrice">
                  <strong>{formatPrice(discountedPrice)} STQ</strong>
                </div>
              )}
              <div styleName="cashbackWrap">
                <div
                  styleName={classNames('cashback', {
                    noneCashback: !cashbackValue,
                  })}
                >
                  <b>{`Cashback  ${cashbackValue || 0}%`}</b>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }
}

export default CardProduct;
