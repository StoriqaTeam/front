// @flow

import React, { PureComponent } from 'react';
import { head, pathOr, find, propEq } from 'ramda';

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
    console.log('&&&&& CardProduct item: ', this.props.item);
    const lang = 'EN';
    const nameArr = baseProduct ? baseProduct.name : null;
    const img = pathOr(null, ['product', 'photoMain'], head(variants));
    const undiscountedPrice = Number(pathOr(null, ['product', 'price'], head(variants)));
    const discount = pathOr(null, ['product', 'discount'], head(variants));
    const price = undiscountedPrice * (1 - discount);
    // const currencyId = baseProduct ? baseProduct.currencyId : null;
    const cashback = pathOr(null, ['product', 'cashback'], head(variants)) * 100;

    return (
      <div styleName="container">
        <div styleName="body">
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
              {undiscountedPrice &&
                <div styleName="undiscountedPrice">
                  {formatPrice(undiscountedPrice)} STQ
                </div>
              }
              {price &&
                <div styleName="actualPrice">
                  <strong>{formatPrice(price)} STQ</strong>
                </div>
              }
              {Boolean(cashback) &&
                <div styleName="cashbackWrap">
                  <div styleName="cashback">Cashback {`${cashback}%`}</div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CardProduct;
