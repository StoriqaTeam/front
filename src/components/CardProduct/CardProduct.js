// @flow

import React, { PureComponent } from 'react';
import { Link } from 'found';
import { head, pathOr } from 'ramda';

import { Icon } from 'components/Icon';
import { getNameText } from 'utils';

import { formatPrice } from './utils';

import './CardProduct.scss';

type TranslateType = {
  text: string,
  lang: string,
}

type VariantType = {
  id: string,
  rawId: number,
  product: {
    id: string,
    rawId: number,
    discount: number,
    photoMain: string,
    cashback: number,
    price: number
  },
}

type PropsTypes = {
  item: {
    baseProduct: {
      rawId: number,
      storeId: number,
      name: Array<TranslateType>,
      currencyId: number,
    },
    variants: Array<VariantType>,
  },
};

class CardProduct extends PureComponent<PropsTypes> {
  render() {
    const {
      item: {
        baseProduct,
        variants,
      },
    } = this.props;
    const lang = 'EN';

    const productId = baseProduct ? baseProduct.rawId : null;
    const storeId = baseProduct ? baseProduct.storeId : null;
    const productLink = (productId && storeId) ? `store/${storeId}/products/${productId}` : '/';
    const nameArr = baseProduct ? baseProduct.name : null;
    const img = pathOr(null, ['product', 'photoMain'], head(variants));
    const undiscountedPrice = Number(pathOr(null, ['product', 'price'], head(variants)));
    const discount = pathOr(null, ['product', 'discount'], head(variants));
    const price = undiscountedPrice * (1 - discount);
    const cashback = pathOr(0, ['product', 'cashback'], head(variants));
    const cashbackValue = cashback ? (cashback * 100).toFixed(0) : null;

    console.log('---variants', variants);
    console.log('---price', undiscountedPrice);
    console.log('---discount', discount);
    console.log('---price with discount', price);
    console.log('****************************************************************************');

    return (
      <div styleName="container">
        <Link
          to={productLink}
          styleName="body"
        >
          <div styleName="top">
            {!img ?
              <Icon type="camera" size="40" /> :
              <img styleName="img" src={img} alt="img" />
            }
          </div>
          <div styleName="bottom">
            <div styleName="icon">
              <Icon type="qa" size="20" />
            </div>
            {nameArr && <div styleName="title">{getNameText(nameArr, lang)}</div>}
            <div styleName="price">
              {Boolean(discount) &&
                <div styleName="undiscountedPrice">
                  {formatPrice(undiscountedPrice)} STQ
                </div>
              }
              {price &&
                <div styleName="actualPrice">
                  <strong>{formatPrice(price)} STQ</strong>
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
