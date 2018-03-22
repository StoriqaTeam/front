import React, { Component } from 'react';
import { head, last, slice, append, concat } from 'ramda';

export default OriginalComponent => class HandlerSlideDecorator extends Component {
  state = {
    sliderWrapperWidth: {},
    visibleSlidesAmount: 0,
    totalSlidesAmount: 0,
    slidesOffset: 0,
    showAllSlides: false,
    num: 0,
    children: [],
    isTransition: false,
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
    const { slidesToShow, responsive, items, children, isInfinity } = this.props; // eslint-disable-line
    const { showAllSlides, num } = this.state;
    const totalSlidesAmount = items.length;
    const sliderWrapperWidth = this.originalComponentElement.getBoundingClientRect().width;
    let visibleSlidesAmount = slidesToShow;
    const slideWidth = sliderWrapperWidth / visibleSlidesAmount;

    if (responsive) {
      responsive.forEach((i) => {
        if (sliderWrapperWidth < i.breakpoint) {
          visibleSlidesAmount = i.slidesToShow;
        }
      });
    }

    this.setState({
      sliderWrapperWidth,
      visibleSlidesAmount,
      totalSlidesAmount,
      showAllSlides: showAllSlides || visibleSlidesAmount >= totalSlidesAmount,
    });

    if (isInfinity) {
      if (this.timer) {
        clearTimeout(this.timer);
      }

      this.timer = setTimeout(() => {
        this.swapArray(num, children);
      }, 500);

      this.setState({ slidesOffset: -slideWidth });
    } else {
      this.setState({ children });
    }
  }

  handleSlide = (direction) => {
    const { isInfinity } = this.props;
    const {
      sliderWrapperWidth,
      visibleSlidesAmount,
      slidesOffset,
      totalSlidesAmount,
      children,
      num,
      isTransition,
    } = this.state;

    if (isTransition && isInfinity) {
      return;
    }

    const slideWidth = sliderWrapperWidth / visibleSlidesAmount;
    const possibleOffset = ((totalSlidesAmount - visibleSlidesAmount) + 1) * slideWidth;

    if ((slidesOffset >= 0 && direction === 'prev') ||
      (-possibleOffset >= (slidesOffset - slideWidth) && direction === 'next')) {
      return;
    }

    this.setState({
      slidesOffset: direction === 'next' ? slidesOffset - slideWidth : slidesOffset + slideWidth,
      isTransition: true,
    });

    if (isInfinity) {
      const newNum = direction === 'next' ? num + 1 : num - 1;

      if (this.timer) {
        clearTimeout(this.timer);
      }

      this.timer = setTimeout(() => {
        this.swapArray(newNum, children, direction);
      }, 500);
    }
  }

  swapArray = (num, arr, direction) => {
    let newChildren;
    const {
      sliderWrapperWidth,
      visibleSlidesAmount,
    } = this.state;

    const slideWidth = sliderWrapperWidth / visibleSlidesAmount;

    if (num === 0 || direction === 'prev') {
      const lastItem = last(arr);
      const slicedItems = slice(0, arr.length - 1, arr);
      newChildren = concat([lastItem], slicedItems);
    } else {
      const firstItem = head(arr);
      const slicedItems = slice(1, arr.length, arr);
      newChildren = append(firstItem, slicedItems);
    }

    this.setState({
      children: newChildren,
      num,
      slidesOffset: -slideWidth,
      isTransition: false,
    });
  }

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
