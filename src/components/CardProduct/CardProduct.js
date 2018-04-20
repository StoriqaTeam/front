// @flow

import React, { PureComponent } from 'react';
import { Link } from 'found';
import { head } from 'ramda';

import { Icon } from 'components/Icon';
import { getNameText } from 'utils';

import { formatPrice } from './utils';

import './CardProduct.scss';

type VariantType = {
  discount: number,
  photoMain: string,
  cashback: number,
  price: number,
}

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
  }
}

class CardProduct extends PureComponent<PropsTypes> {
  render() {
    const {
      item: {
        rawId,
        storeId,
        name,
        variants,
        currencyId,
      },
    } = this.props;
    if (!storeId || !rawId || !currencyId || !variants || variants.length === 0) return null;
    const {
      discount,
      photoMain,
      cashback,
      price,
    } = head(variants);
    const lang = 'EN';
    const productLink = `/store/${storeId}/products/${rawId}`;
    const discountedPrice = price * (1 - discount);
    const cashbackValue = cashback ? (cashback * 100).toFixed(0) : null;
    return (
      <div styleName="container">
        <Link
          to={productLink}
          styleName="body"
        >
          <div styleName="top">
            {!photoMain ?
              <Icon type="camera" size="40" /> :
              <img styleName="img" src={photoMain} alt="img" />
            }
          </div>
          <div styleName="bottom">
            <div styleName="icon">
              <Icon type="qa" size="20" />
            </div>
            {name && <div styleName="title">{getNameText(name, lang)}</div>}
            <div styleName="price">
              {Boolean(discount) &&
                <div styleName="undiscountedPrice">
                  {formatPrice(price)} STQ
                </div>
              }
              {discountedPrice &&
                <div styleName="actualPrice">
                  <strong>{formatPrice(discountedPrice)} STQ</strong>
                </div>
              }
              {cashbackValue &&
                <div styleName="cashbackWrap">
                  <div styleName="cashback">Cashback {`${cashbackValue}%`}</div>
                </div>
              }
            </div>
          </div>
        </Link>
      </div>
    );
  }
}

export default CardProduct;
