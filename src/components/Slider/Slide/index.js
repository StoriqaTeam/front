import React, { Component } from 'react';
import PropTypes from 'prop-types';

import formatPrice from '../utils/formatPrice';

class Slide extends Component {
  render() {
    const {
      slideWidth,
      item: {
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
          width: `${slideWidth}%`,
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

Slide.propTypes = {
  slideWidth: PropTypes.number.isRequired,
  item: PropTypes.object.isRequired, // eslint-disable-line
};

export default Slide;
