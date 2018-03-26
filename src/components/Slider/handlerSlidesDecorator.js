import React, { Component } from 'react';

export default OriginalComponent => class HandlerSlideDecorator extends Component {
  state = {
    sliderWrapperWidth: {},
    visibleSlidesAmount: 0,
    totalSlidesAmount: 0,
    slidesOffset: 0,
    showAllSlides: false,
  };

  componentWillMount() {
    if (process.env.BROWSER) {
      window.addEventListener('resize', this.sliderPropsCalc);
    }
  }

  componentDidMount() {
    this.sliderPropsCalc();
  }

  componentWillUnmount() {
    if (process.env.BROWSER) {
      window.removeEventListener('resize', this.sliderPropsCalc);
    }
  }

  sliderPropsCalc = () => {
    const { slidesToShow, responsive, items } = this.props; // eslint-disable-line
    const { showAllSlides } = this.state;
    const totalSlidesAmount = items.length;
    const sliderWrapperWidth = this.originalComponentElement.getBoundingClientRect().width;
    let visibleSlidesAmount = slidesToShow;

    responsive.forEach((i) => {
      if (sliderWrapperWidth < i.breakpoint) {
        visibleSlidesAmount = i.slidesToShow;
      }
    });

    this.setState({
      sliderWrapperWidth,
      visibleSlidesAmount,
      totalSlidesAmount,
      showAllSlides: showAllSlides || visibleSlidesAmount >= totalSlidesAmount,
    });
  };

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
  };

  render() {
    return (
      <OriginalComponent
        originalComponentRef={(el) => { this.originalComponentElement = el; }}
        {...this.props}
        {...this.state}
        handleSlide={this.handleSlide}
      />
    );
  }
};
