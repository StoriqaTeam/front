// @flow

import React, { PureComponent } from 'react';

import { formatPrice } from './utils';

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
      <div className="CardProduct">
        <div className="CardProduct--body">
          <div className="CardProduct--top">
            <img className="CardProduct--img" src={img} />
            <div className="CardProduct--labels">
              {sellerDiscount &&
              <div className="CardProduct--labels--discount">
                {`-${sellerDiscount}%`}
              </div>
              }
              {qualityAssurance &&
              <div className="CardProduct--labels--qa">
                <img src={require('assets/img/qa-icon.svg')} alt="qa" />
              </div>
              }
            </div>
          </div>
          <div className="CardProduct--bottom">
            <div className="CardProduct--title">{title}</div>
            <div className="CardProduct--price">
              <div className="CardProduct--price--left">
                <div className="CardProduct--price--left--actual-price">
                  <b>{formatPrice(prices.btc.actualPrice)}</b> {prices.btc.charCode}
                </div>
                <div className="CardProduct--price--left--undiscounted-price">
                  {formatPrice(prices.btc.undiscountedPrice)} {prices.btc.charCode}
                </div>
              </div>
              <div className="CardProduct--price--right">
                <div className="CardProduct--price--right--discount">
                  {`-${prices.stq.discount}%`}
                </div>
                <div className="CardProduct--price--right--actual-price">
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
