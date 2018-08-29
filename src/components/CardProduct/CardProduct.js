// @flow

import React, { PureComponent } from 'react';
import { Link } from 'found';
import { head, map } from 'ramda';
import classNames from 'classnames';

import { Icon } from 'components/Icon';
import { Rating } from 'components/common/Rating';
import { MultiCurrencyDropdown } from 'components/common/MultiCurrencyDropdown';
import BannerLoading from 'components/Banner/BannerLoading';
import { getNameText, formatPrice, convertSrc, currentCurrency } from 'utils';
import ImageLoader from 'libs/react-image-loader';

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
  },
};

class CardProduct extends PureComponent<PropsType> {
  render() {
    const {
      item: { rawId, storeId, name, products, currency, rating },
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
              <ImageLoader
                fit
                src={convertSrc(photoMain || '', 'medium')}
                loader={<BannerLoading />}
              />
            )}
          </div>
          <div styleName="bottom">
            <div styleName="icon">{false && <Icon type="qa" size="20" />}</div>
            <div>
              <Rating value={rating} />
              {name && <div styleName="title">{getNameText(name, lang)}</div>}
            </div>
            <div styleName="undiscountedPrice">
              {Boolean(discount) && (
                <span>
                  {formatPrice(price)} {currentCurrency()}
                </span>
              )}
            </div>
            <div styleName="price">
              {discountedPrice && (
                <MultiCurrencyDropdown
                  elementStyleName="priceDropdown"
                  price={discountedPrice}
                  renderPrice={(priceItem: {
                    price: number,
                    currencyCode: string,
                  }) => (
                    <div styleName="priceDropdown">
                      <div styleName="actualPrice">
                        {`${formatPrice(priceItem.price)} ${
                          priceItem.currencyCode
                        }`}
                      </div>
                    </div>
                  )}
                  renderDropdown={(
                    rates: Array<{ currencyCode: string, value: number }>,
                  ) => (
                    <div styleName="priceDropdownList">
                      {map(
                        item =>
                          item.currencyCode !== currentCurrency() && (
                            <div
                              key={`priceDropdownItem-${
                                this.props.item.rawId
                              }-${item.currencyCode}`}
                            >
                              {`${formatPrice(item.value)} ${
                                item.currencyCode
                              }`}
                            </div>
                          ),
                        rates,
                      )}
                    </div>
                  )}
                  renderDropdownToggle={(isDropdownOpened: boolean) => {
                    if (isDropdownOpened) {
                      return <button styleName="toggleRatesDropdownClosed" />;
                    }
                    return <button styleName="toggleRatesDropdownOpened" />;
                  }}
                />
              )}
              <div styleName="cashbackWrapper">
                <div
                  styleName={classNames('cashback', {
                    noneCashback: !cashbackValue,
                  })}
                >
                  <b>Cashback</b>
                  <b styleName="value">{`${cashbackValue || 0}%`}</b>
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
