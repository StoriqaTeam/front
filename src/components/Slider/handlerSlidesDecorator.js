import React, { Component } from 'react';
import { head, last, slice, append, concat } from 'ramda';

type PropsTypes = {
  slidesToShow: number,
  responsive: Object,
  items: Array,
  children: Array,
  isInfinity: ?boolean,
  autoplaySpeed: ?number,
  animationSpeed: number,
};

export default (OriginalComponent: any) => class HandlerSlideDecorator extends Component<PropsTypes> {// eslint-disable-line
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

    if (this.props.autoplaySpeed) {
      this.activateAutoplayTimer();
    }
  }

  componentDidMount() {
    this.sliderPropsCalc();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.sliderPropsCalc);

    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
    }
    if (this.swapTimer) {
      clearTimeout(this.swapTimer);
    }
  }

  activateAutoplayTimer = () => {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
    }
    this.autoplayInterval = setInterval(() => {
      this.handleSlide('next');
    }, this.props.autoplaySpeed);
  }

  sliderPropsCalc = () => {
    const {
      slidesToShow,
      responsive,
      items,
      children,
      isInfinity,
      animationSpeed,
    } = this.props;
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
      if (this.swapTimer) {
        clearTimeout(this.swapTimer);
      }

      this.swapTimer = setTimeout(() => {
        this.swapArray(num, children);
      }, animationSpeed);

      this.setState({ slidesOffset: -slideWidth });
    } else {
      this.setState({ children });
    }
  }

  handleSlide = (direction) => {
    const { isInfinity, animationSpeed, autoplaySpeed } = this.props;
    const {
      sliderWrapperWidth,
      visibleSlidesAmount,
      slidesOffset,
      totalSlidesAmount,
      children,
      num,
      isTransition,
    } = this.state;

    if (isTransition && isInfinity) { return; }
    if (autoplaySpeed) { this.activateAutoplayTimer(); }

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
      if (this.swapTimer) {
        clearTimeout(this.swapTimer);
      }

      this.swapTimer = setTimeout(() => {
        this.swapArray(direction === 'next' ? num + 1 : num - 1, children, direction);
      }, animationSpeed);
    }
  }

  swapArray = (num, arr, direction) => {
    let newChildren;

    const {
      sliderWrapperWidth,
      visibleSlidesAmount,
      totalSlidesAmount,
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

    let newNum;
    if (direction === 'next') {
      newNum = num === totalSlidesAmount ? 0 : num;
    } else {
      newNum = num === -1 ? totalSlidesAmount - 1 : num;
    }

    this.setState({
      children: newChildren,
      num: newNum,
      slidesOffset: -slideWidth,
      isTransition: false,
    });
  }

  handleDot = (dotIdx) => {
    const { isInfinity } = this.props;
    const {
      sliderWrapperWidth,
      visibleSlidesAmount,
      slidesOffset,
      children,
      num,
      isTransition,
    } = this.state;

    const diff = dotIdx - num;

    if (!diff || (isTransition && isInfinity)) {
      return;
    }

    let direction;

    if (diff > 0) {
      direction = 'next';
    }

    if (diff < 0) {
      direction = 'prev';
    }

    const slideWidth = sliderWrapperWidth / visibleSlidesAmount;

    this.setState({
      slidesOffset: direction === 'next' ?
        slidesOffset - (slideWidth * diff) :
        slidesOffset - (slideWidth * diff),
      isTransition: true,
    });

    if (isInfinity) {
      if (this.swapTimer) {
        clearTimeout(this.swapTimer);
      }

      this.swapTimer = setTimeout(() => {
        this.swapArray(num + diff, children, direction, diff);
      }, 500);
    }
  }

  render() {
    return (
      <OriginalComponent
        originalComponentRef={(el) => { this.originalComponentElement = el; }}
        {...this.props}
        {...this.state}
        handleSlide={this.handleSlide}
        handleDot={this.handleDot}
      />
    );
  }
};
