import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import formatPrice from 'helpers/formatPrice';

class Slider extends PureComponent {
  state = {
    sliderWrapperWidth: {},
    visibleSlidesAmount: null,
    totalSlidesAmount: null,
    slidesOffset: 0,
    showAllSlides: false,
  };

  componentWillMount() {
    window.addEventListener('resize', this.sliderPropsCalc);
  }

  componentDidMount() {
    this.sliderPropsCalc();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.sliderPropsCalc);
  }

  sliderPropsCalc = () => {
    const { slidesToShow, responsive } = this.props;
    const { showAllSlides } = this.state;
    const totalSlidesAmount = this.props.items.length;
    const sliderWrapperWidth = this.sliderWrapper.getBoundingClientRect().width;
    let visibleSlidesAmount = slidesToShow;

    responsive.forEach((i) => {
      if (sliderWrapperWidth + 16 < i.breakpoint) {
        visibleSlidesAmount = i.slidesToShow;
      }
    });

    this.setState({
      sliderWrapperWidth,
      visibleSlidesAmount,
      totalSlidesAmount,
      showAllSlides: showAllSlides || visibleSlidesAmount >= totalSlidesAmount,
    });
  }

  handlerShowSlides = () => {
    this.setState({
      showAllSlides: !this.state.showAllSlides,
      slidesOffset: 0,
    });
  }

  handleSlide = (direction) => {
    const {
      sliderWrapperWidth,
      visibleSlidesAmount,
      slidesOffset,
      totalSlidesAmount,
    } = this.state;
    const slideWidth = sliderWrapperWidth / visibleSlidesAmount;
    const possibleOffset = ((totalSlidesAmount - visibleSlidesAmount) + 1) * slideWidth;

    if ((slidesOffset >= 0 && direction === 'prev') ||
       (-possibleOffset >= (slidesOffset - slideWidth) && direction === 'next')) {
      return;
    }

    this.setState({ slidesOffset: direction === 'next' ? slidesOffset - slideWidth : slidesOffset + slideWidth });
  }

  render() {
    const { title, color, items } = this.props;
    const {
      visibleSlidesAmount,
      slidesOffset,
      showAllSlides,
      totalSlidesAmount,
    } = this.state;
    const slideWidth = 100 / visibleSlidesAmount;
    const isRevealButton = visibleSlidesAmount < totalSlidesAmount;
    const toggleAllText = showAllSlides ? 'Hide some' : 'See all';

    return (
      <div className="Slider">
        <div className="Slider--header">
          <div className="Slider--header--title" style={{ color }}>{title}</div>
          {isRevealButton &&
            <div
              className="Slider--header--reveal"
              onClick={this.handlerShowSlides}
              style={{ color }}
            >
              {toggleAllText}
            </div>
          }
          {!showAllSlides &&
            <div className="Slider--header--nav">
              <button
                direction="prev"
                className="Slider--header--nav--button Slider--header--nav--button-prev"
                onClick={() => this.handleSlide('prev')}
              >
                <img src={require('assets/img/prev-button-icon.svg')} alt="prev" />
              </button>
              <button
                direction="next"
                className="Slider--header--nav--button Slider--header--nav--button-next"
                onClick={() => this.handleSlide('next')}
              >
                <img src={require('assets/img/next-button-icon.svg')} alt="next" />
              </button>
            </div>
          }
        </div>
        <div
          ref={(sliderWrapper) => { this.sliderWrapper = sliderWrapper; }}
          className="Slider--wrapper"
          style={{
            left: slidesOffset,
            whiteSpace: showAllSlides ? 'normal' : 'nowrap',
          }}
        >
          {items.map((item) => { // eslint-disable-line
            const { title, qualityAssurance, sellerDiscount, prices } = item; // eslint-disable-line
            return (
              <div
                key={item.id}
                className="Slider--wrapper--slide"
                style={{
                  width: `${slideWidth}%`,
                }}
              >
                <div className="Slider--wrapper--slide--body">
                  <div className="Slider--wrapper--slide--top">
                    <div className="Slider--wrapper--slide--labels">
                      {sellerDiscount &&
                        <div className="Slider--wrapper--slide--labels--discount">
                          {`-${sellerDiscount}%`}
                        </div>
                      }
                      {qualityAssurance &&
                        <div className="Slider--wrapper--slide--labels--qa">
                          <img src={require('assets/img/qa-icon.svg')} alt="qa" />
                        </div>
                      }
                    </div>
                  </div>
                  <div className="Slider--wrapper--slide--bottom">
                    <div className="Slider--wrapper--slide--title">{title}</div>
                    <div className="Slider--wrapper--slide--price">
                      <div className="Slider--wrapper--slide--price--left">
                        <div className="Slider--wrapper--slide--price--left--actual-price">
                          <b>{formatPrice(prices.btc.actualPrice)}</b> {prices.btc.charCode}
                        </div>
                        <div className="Slider--wrapper--slide--price--left--undiscounted-price">
                          {formatPrice(prices.btc.undiscountedPrice)} {prices.btc.charCode}
                        </div>
                      </div>
                      <div className="Slider--wrapper--slide--price--right">
                        <div className="Slider--wrapper--slide--price--right--discount">
                          {`-${prices.stq.discount}%`}
                        </div>
                        <div className="Slider--wrapper--slide--price--right--actual-price">
                          {prices.stq.charCode} {formatPrice(prices.stq.actualPrice)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

Slider.propTypes = {
  title: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  slidesToShow: PropTypes.number.isRequired,
  responsive: PropTypes.array.isRequired,
  items: PropTypes.array.isRequired, // eslint-disable-line
};

export default Slider;
