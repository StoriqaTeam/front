import React, { PureComponent } from 'react';

import { formatPrice } from './utils';

class CardProduct extends PureComponent {
  render() {
    const {
      width,
      data: {
        title,
        qualityAssurance,
        sellerDiscount,
        prices,
      },
    } = this.props;

    return (
      <div
        className="Slide"
        style={{
          width: `${width}%`,
        }}
      >
        <div className="Slide--body">
          <div className="Slide--top">
            <div className="Slide--labels">
              {sellerDiscount &&
              <div className="Slide--labels--discount">
                {`-${sellerDiscount}%`}
              </div>
              }
              {qualityAssurance &&
              <div className="Slide--labels--qa">
                <img src={require('assets/img/qa-icon.svg')} alt="qa" />
              </div>
              }
            </div>
          </div>
          <div className="Slide--bottom">
            <div className="Slide--title">{title}</div>
            <div className="Slide--price">
              <div className="Slide--price--left">
                <div className="Slide--price--left--actual-price">
                  <b>{formatPrice(prices.btc.actualPrice)}</b> {prices.btc.charCode}
                </div>
                <div className="Slide--price--left--undiscounted-price">
                  {formatPrice(prices.btc.undiscountedPrice)} {prices.btc.charCode}
                </div>
              </div>
              <div className="Slide--price--right">
                <div className="Slide--price--right--discount">
                  {`-${prices.stq.discount}%`}
                </div>
                <div className="Slide--price--right--actual-price">
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
