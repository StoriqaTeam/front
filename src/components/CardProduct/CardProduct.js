// @flow

import React, { PureComponent } from 'react';
import { Link } from 'found';
import { head } from 'ramda';
import classNames from 'classnames';

import { CurrencyPrice } from 'components/common';
import { Icon } from 'components/Icon';
import { Rating } from 'components/common/Rating';
import { MultiCurrencyDropdown } from 'components/common/MultiCurrencyDropdown';
import BannerLoading from 'components/Banner/BannerLoading';
import { getNameText, formatPrice, convertSrc, currentCurrency } from 'utils';
import ImageLoader from 'libs/react-image-loader';

import { CardProductCashback, CardProductDropdown } from './index';

import './CardProduct.scss';

type VariantType = {
  cashback: ?number,
  discount: ?number,
  id: string,
  photoMain: ?string,
  price: ?number,
  rawId: ?number,
};

type PropsType = {
  item: {
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
    priceUsd: ?number,
    store: {
      name: Array<{
        lang: string,
        text: string,
      }>,
    },
  },
  isSearchPage: boolean,
};

class CardProduct extends PureComponent<PropsType> {
  render() {
    const {
      item: {
        rawId,
        storeId,
        name,
        products,
        currency,
        rating,
        priceUsd,
        store,
      },
      isSearchPage,
    } = this.props;
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
              <Icon type="camera" size={40} />
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
                      {formatPrice(price)} {currentCurrency()}
                    </span>
                  )}
                </div>
                <MultiCurrencyDropdown
                  elementStyleName="priceDropdown"
                  price={discountedPrice}
                  renderPrice={(priceItem: {
                    price: number,
                    currencyCode: string,
                  }) => (
                    <div styleName="priceDropdown">
                      <div styleName="actualPrice">
                        {discountedPrice === 0
                          ? 'FREE'
                          : `${formatPrice(priceItem.price)} ${
                              priceItem.currencyCode
                            }`}
                      </div>
                      {priceUsd && (
                        <CurrencyPrice
                          reverse
                          dark
                          withTilda
                          withSlash
                          price={priceItem.price || 0}
                          fontSize={16}
                          currencyPrice={priceUsd}
                          currencyCode="$"
                          toFixedValue={2}
                        />
                      )}
                    </div>
                  )}
                  renderDropdown={(
                    rates: Array<{ currencyCode: string, value: number }>,
                  ) => <CardProductDropdown rates={rates} />}
                  renderDropdownToggle={(isDropdownOpened: boolean) => (
                    <button
                      styleName={`toggleRatesDropdown${
                        isDropdownOpened ? 'Closed' : 'Opened'
                      }`}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }
}

export default CardProduct;
