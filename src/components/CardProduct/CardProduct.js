// @flow

import React, { PureComponent } from 'react';
import { Link } from 'found';
import { head, pathOr, find, propEq } from 'ramda';

import { Icon } from 'components/Icon';

import { formatPrice } from './utils';

import './CardProduct.scss';

type PropsTypes = {
  item: {
    baseProduct: {
      rawId: number,
      storeId: number,
      name: {
        lang: string,
        text: string,
      },
      currencyId: number,
    },
    variants: {
      discount: ?string,
      photoMain: ?string,
      cashback: ?string,
      price: ?string,
    },
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
    const productLink = (productId && storeId) ? `stores/${storeId}/products/${productId}` : '/';
    const name = baseProduct ? baseProduct.name : null;
    const title = find(propEq('lang', lang))(name).text;
    const img = pathOr(null, ['product', 'photoMain'], head(variants));
    const undiscountedPrice = Number(pathOr(null, ['product', 'price'], head(variants)));
    const discount = pathOr(null, ['product', 'discount'], head(variants));
    const price = undiscountedPrice * (1 - discount);
    // const currencyId = baseProduct ? baseProduct.currencyId : null;
    const cashback = pathOr(0, ['product', 'cashback'], head(variants));
    const cashbackValue = cashback ? (cashback * 100).toFixed(0) : null;

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
            {title && <div styleName="title">{title}</div>}
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
