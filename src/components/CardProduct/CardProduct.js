// @flow

import React, { PureComponent } from 'react';
import { Link } from 'found';
import { head } from 'ramda';
import classNames from 'classnames';

import { Icon } from 'components/Icon';
import { Rating } from 'components/common/Rating';
import BannerLoading from 'components/Banner/BannerLoading';
import {
  getNameText,
  formatPrice,
  convertSrc,
  getExchangePrice,
  verifyItemCurrency,
  checkCurrencyType,
} from 'utils';
import ImageLoader from 'libs/react-image-loader';
import { ContextDecorator } from 'components/App';

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

export type ItemType = {
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

type CurrencyExhangeType = {
  code: string,
  rates: Array<{
    code: string,
    value: number,
  }>,
};

type PropsType = {
  item: ItemType,
  isSearchPage: boolean,
  directories: {
    currencyExchange: Array<CurrencyExhangeType>,
  },
};

class CardProduct extends PureComponent<PropsType> {
  render() {
    const { item, isSearchPage, directories } = this.props;
    const {
      rawId,
      storeId,
      name,
      products,
      currency,
      rating,
      store,
    } = verifyItemCurrency(item);
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
    const productLink = `/store/${storeId}/products/${rawId}${
      product ? `/variant/${product.node.rawId}` : ''
    }`;
    const discountedPrice = discount ? price * (1 - discount) : price;
    const discountValue = discount ? (discount * 100).toFixed(0) : null;
    const cashbackValue = cashback ? (cashback * 100).toFixed(0) : null;
    const priceExchanged = getExchangePrice({
      price,
      currency,
      currencyExchange: directories.currencyExchange,
      withSymbol: true,
    });

    return (
      <div styleName="container">
        <Link
          to={productLink}
          styleName="body"
          data-test={`cardProduct_${rawId}`}
          exact
        >
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
                      {formatPrice(
                        price,
                        checkCurrencyType(currency) === 'fiat' ? 2 : undefined,
                      )}{' '}
                      {currency}
                    </span>
                  )}
                </div>
                <div styleName="priceDropdown">
                  <div styleName="actualPrice">
                    {discountedPrice === 0
                      ? 'FREE'
                      : `${formatPrice(
                          discountedPrice,
                          checkCurrencyType(currency) === 'fiat'
                            ? 2
                            : undefined,
                        )} ${currency}`}
                  </div>
                  {priceExchanged && (
                    <span styleName="priceExchanged">{priceExchanged}</span>
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

export default ContextDecorator(CardProduct);
