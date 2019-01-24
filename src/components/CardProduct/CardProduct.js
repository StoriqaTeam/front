// @flow

import React, { PureComponent } from 'react';
import { Link } from 'found';
import { head, path, assocPath, ifElse } from 'ramda';
import classNames from 'classnames';

import { CurrencyPrice } from 'components/common';
import { Icon } from 'components/Icon';
import { Rating } from 'components/common/Rating';
// import { MultiCurrencyDropdown } from 'components/common/MultiCurrencyDropdown';
import BannerLoading from 'components/Banner/BannerLoading';
import {
  getNameText,
  formatPrice,
  convertSrc,
  checkCurrencyType,
  getCookie,
} from 'utils';
import ImageLoader from 'libs/react-image-loader';

import { COOKIE_FIAT_CURRENCY, COOKIE_CURRENCY } from 'constants';

import { CardProductCashback } from './index';

import './CardProduct.scss';

type VariantType = {
  cashback: ?number,
  discount: ?number,
  id: string,
  photoMain: ?string,
  price: ?number,
  rawId: ?number,
  customerPrice: {
    price: number,
    currency: string,
  },
};

type ItemType = {
  rawId: number,
  storeId: number,
  currency: string,
  name: Array<{
    lang: string,
    text: string,
  }>,
  products: {
    edges: Array<{
      node: VariantType,
    }>,
  },
  rating: number,
  store: {
    name: Array<{
      lang: string,
      text: string,
    }>,
  },
  priceUsd: ?number,
};

type PropsType = {
  item: ItemType,
  isSearchPage: boolean,
};

const setCurrency = (item: ItemType): ItemType => {
  const { node } = head(path(['products', 'edges'], item));
  const itemWithCurrency = assocPath(
    ['products', 'edges'],
    [
      {
        node: {
          ...node,
          price: node.customerPrice.price,
        },
      },
    ],
    item,
  );

  return {
    ...itemWithCurrency,
    currency: node.customerPrice.currency,
  };
};

class CardProduct extends PureComponent<PropsType> {
  applyCurrency = item => {
    const handleFiat = currentItem => {
      const cookieFiat = getCookie(COOKIE_FIAT_CURRENCY);
      if (currentItem.currency !== cookieFiat) {
        return setCurrency(currentItem);
      }
      return currentItem;
    };

    const handleCrypto = currentItem => {
      const cookieCrypto = getCookie(COOKIE_CURRENCY);
      if (currentItem.currency !== cookieCrypto) {
        return setCurrency(currentItem);
      }
      return currentItem;
    };

    const verifyItemCurrency = currentItem =>
      checkCurrencyType(currentItem.currency) === 'fiat';

    return ifElse(verifyItemCurrency, handleFiat, handleCrypto)(item);
  };

  render() {
    const { item, isSearchPage } = this.props;
    const {
      rawId,
      storeId,
      name,
      products,
      currency,
      rating,
      store,
      priceUsd,
    } = this.applyCurrency(item);
    let discount = null;
    let photoMain = null;
    let cashback = null;
    let price = null;
    const product = head(products.edges);
    if (product) {
      ({ discount, photoMain, cashback, price } = product.node);
    }

    if (!storeId || !rawId || !currency || !price) return null;

    const lang = 'EN';
    const productLink = `/store/${storeId}/products/${rawId}`;
    const discountedPrice = discount ? price * (1 - discount) : price;
    const discountValue = discount ? (discount * 100).toFixed(0) : null;
    const cashbackValue = cashback ? (cashback * 100).toFixed(0) : null;
    //
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
              <div styleName="emptyFoto">
                <Icon type="camera" size={40} />
              </div>
            ) : (
              <ImageLoader
                fit
                src={convertSrc(photoMain || '', 'medium')}
                loader={
                  <div styleName="bannerLoading">
                    <BannerLoading />
                  </div>
                }
              />
            )}
          </div>
          <div styleName="bottom">
            <div styleName="levelOne">
              <Rating value={rating} />
              {Boolean(cashbackValue) && (
                <CardProductCashback cashbackValue={cashbackValue} />
              )}
            </div>
            {name && (
              <div styleName="titleWrap">
                <div styleName="title">{getNameText(name, lang)}</div>
                {store &&
                  store.name && (
                    <div styleName="store">{getNameText(store.name, lang)}</div>
                  )}
              </div>
            )}
            <div styleName="priceWrap">
              <div
                styleName={classNames('price', {
                  isSearchPage,
                })}
              >
                <div styleName="undiscountedPrice">
                  {Boolean(discount) && (
                    <span>
                      {formatPrice(price)} {currency}
                    </span>
                  )}
                </div>
                <div styleName="priceDropdown">
                  <div styleName="actualPrice">
                    {discountedPrice === 0
                      ? 'FREE'
                      : `${formatPrice(discountedPrice)} ${currency}`}
                  </div>
                  {priceUsd && (
                    <CurrencyPrice
                      reverse
                      dark
                      withTilda
                      withSlash={priceUsd != null}
                      price={priceUsd || 0}
                      fontSize={16}
                      currencyPrice={priceUsd}
                      currencyCode="$"
                      toFixedValue={2}
                    />
                  )}
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
