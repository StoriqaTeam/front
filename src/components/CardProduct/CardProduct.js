// @flow

import React, { PureComponent } from 'react';

import { Icon } from 'components/Icon';

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
      <div styleName="container">
        <div styleName="body">
          <div styleName="top">
            <img styleName="img" src={img} alt="img" />
            <div styleName="labels">
              {sellerDiscount &&
              <div styleName="seller-discount">
                <strong>{`-${sellerDiscount}%`}</strong>
              </div>
              }
              {qualityAssurance &&
              <div styleName="qa-icon">
                <Icon type="qa" size="24" />
              </div>
              }
            </div>
          </div>
          <div styleName="bottom">
            <div styleName="title">{title}</div>
            <div styleName="price">
              <div styleName="left">
                <div styleName="actual-price">
                  <b>{formatPrice(prices.btc.actualPrice)}</b> {prices.btc.charCode}
                </div>
                <div styleName="undiscounted-price">
                  {formatPrice(prices.btc.undiscountedPrice)} {prices.btc.charCode}
                </div>
              </div>
              <div styleName="right">
                <div styleName="price-discount">
                  {`-${prices.stq.discount}%`}
                </div>
                <div styleName="actual-price">
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
