// @flow

import React, { PureComponent } from 'react';

import { formatPrice } from './utils';

import './CardProduct.scss';

type PricesTypes = {
  charCode: number,
  actualPrice: number,
  undiscountedPrice: number,
  discount: number,
}

type PropsTypes = {
  data: {
    title: string,
    qualityAssurance: boolean,
    sellerDiscount: number,
    prices: {
      [any]: PricesTypes,
    },
    img: string,
  },
};

class CardProduct extends PureComponent<PropsTypes> {
  render() {
    const {
      data: {
        title,
        qualityAssurance,
        sellerDiscount,
        prices,
        img,
      },
    } = this.props;

    return (
      <div styleName="cardProduct">
        <div styleName="body">
          <div styleName="top">
            <img styleName="img" src={img} />
            <div styleName="labels">
              {sellerDiscount &&
              <div styleName="labels--discount">
                {`-${sellerDiscount}%`}
              </div>
              }
              {qualityAssurance &&
              <div styleName="labels--qa">
                <img src={require('assets/img/qa-icon.svg')} alt="qa" />
              </div>
              }
            </div>
          </div>
          <div styleName="bottom">
            <div styleName="title">{title}</div>
            <div styleName="price">
              <div styleName="price--left">
                <div styleName="price--left--actual-price">
                  <b>{formatPrice(prices.btc.actualPrice)}</b> {prices.btc.charCode}
                </div>
                <div styleName="price--left--undiscounted-price">
                  {formatPrice(prices.btc.undiscountedPrice)} {prices.btc.charCode}
                </div>
              </div>
              <div styleName="price--right">
                <div styleName="price--right--discount">
                  {`-${prices.stq.discount}%`}
                </div>
                <div styleName="price--right--actual-price">
                  {prices.stq.charCode} {formatPrice(prices.stq.actualPrice)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CardProduct;
