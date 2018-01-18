import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class Slider extends PureComponent {
  state = {
    sliderWrapperWidth: {},
    visibleSlidesAmount: null,
    totalSlidesAmount: null,
    slidesOffset: 0,
  };

  componentWillMount() {
    console.log('componentWillMount');
    window.addEventListener('resize', this.sliderPropsCalc);
  }

  componentDidMount() {
    this.sliderPropsCalc();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.sliderPropsCalc);
  }

  sliderPropsCalc = () => {
    const { sliderWrapper } = this.refs; // eslint-disable-line
    const { items } = this.props;
    const sliderWrapperWidth = sliderWrapper.getBoundingClientRect().width;

    const visibleSlidesAmountCalc = (sliderWrapperWidth) => { // eslint-disable-line
      if (sliderWrapperWidth >= 1200) {
        return 4;
      } else if (sliderWrapperWidth < 1200 && sliderWrapperWidth >= 900) {
        return 3;
      } else if (sliderWrapperWidth < 900 && sliderWrapperWidth >= 576) {
        return 2;
      } else if (sliderWrapperWidth < 576) {
        return 1;
      }
    };

    this.setState({
      sliderWrapperWidth: sliderWrapperWidth, // eslint-disable-line
      visibleSlidesAmount: visibleSlidesAmountCalc(sliderWrapperWidth),
      totalSlidesAmount: items.length,
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
    const { visibleSlidesAmount, slidesOffset } = this.state;
    const slideWidth = 100 / visibleSlidesAmount;
    return (
      <div className="Slider">
        <div className="Slider--title" style={{color}}>{title}</div>
        <div className="Slider--nav">
          <button
            direction="prev"
            className="Slider--nav--button Slider--nav--button-prev"
            onClick={() => this.handleSlide('prev')}
          >
            <img src={require('assets/img/prev-button.svg')} alt="prev" />
          </button>
          <button
            direction="next"
            className="Slider--nav--button Slider--nav--button-next"
            onClick={() => this.handleSlide('next')}
          >
            <img src={require('assets/img/next-button.svg')} alt="next" />
          </button>
        </div>
        <div className="Slider--reveal" style={{color}}>See all</div>
        <div
          ref="sliderWrapper"
          className="Slider--wrapper"
          style={{
            left: slidesOffset,
          }}
        >
          {items.map((item) => { // eslint-disable-line
            return (
              <div
                className="Slider--wrapper--slide"
                style={{
                  width: `${slideWidth}%`,
                }}
              >
                <div className="Slider--wrapper--slide--body">
                  <div className="Slider--wrapper--slide--top">
                    <div className="Slider--wrapper--slide--label">...</div>
                  </div>
                  <div className="Slider--wrapper--slide--bottom">
                    <div className="Slider--wrapper--slide--title">{item.title}</div>
                    <div className="Slider--wrapper--slide--price">
                      <div className="Slider--wrapper--slide--price--left"></div>
                      <div className="Slider--wrapper--slide--price--right"></div>
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
  items: PropTypes.array.isRequired, // eslint-disable-line
};

export default Slider;
