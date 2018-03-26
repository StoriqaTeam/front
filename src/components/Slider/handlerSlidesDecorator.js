// @flow

import React, { Component } from 'react';
import { head, last, slice, append, prepend } from 'ramda';

type PropsTypes = {
  slidesToShow: number,
  responsive: Object, // Match the breakpoint to the number of slides
  children: Array<{}>,
  infinity: ?boolean,
  autoplaySpeed: ?number,
  animationSpeed: number,
};

type StateTypes = {
  sliderWrapperWidth: number,
  visibleSlidesAmount: number,
  totalSlidesAmount: number,
  slidesOffset: number,
  num: number,
  children: Array<{}>,
  isTransition: boolean,
  slideWidth: number,
};

export default (OriginalComponent: any) => class HandlerSlideDecorator extends Component<PropsTypes, StateTypes> {// eslint-disable-line
  state = {
    sliderWrapperWidth: 0,
    visibleSlidesAmount: 0,
    totalSlidesAmount: 0,
    slidesOffset: 0,
    num: 0,
    children: [],
    isTransition: false,
    slideWidth: 0,
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

    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
    }
    if (this.animationTimer) {
      clearTimeout(this.animationTimer);
    }
    if (this.refreshArrayTimer) {
      clearTimeout(this.refreshArrayTimer);
    }
    if (this.animationAndMoveTimer) {
      clearTimeout(this.animationAndMoveTimer);
    }
  }

  autoplayInterval: IntervalID;
  animationTimer: TimeoutID;
  refreshArrayTimer: TimeoutID;
  animationAndMoveTimer: TimeoutID;
  originalComponentElement: Element;

  activateAutoplayTimer = () => {
    const { autoplaySpeed } = this.props;

    if (autoplaySpeed) {
      if (this.autoplayInterval) {
        clearInterval(this.autoplayInterval);
      }
      this.autoplayInterval = setInterval(() => {
        this.handleSlide('next');
      }, autoplaySpeed);
    }
  }

  sliderPropsCalc = () => {
    const {
      infinity,
      slidesToShow,
      responsive,
      children,
      autoplaySpeed,
    } = this.props;
    const totalSlidesAmount = children.length;
    const sliderWrapperWidth = this.originalComponentElement.getBoundingClientRect().width;
    let visibleSlidesAmount = slidesToShow;

    if (responsive) {
      responsive.forEach((i) => {
        if (sliderWrapperWidth < i.breakpoint) {
          visibleSlidesAmount = i.slidesToShow;
        }
      });
    }

    const slideWidth = sliderWrapperWidth / visibleSlidesAmount;

    if (infinity && autoplaySpeed && (visibleSlidesAmount < totalSlidesAmount)) {
      this.activateAutoplayTimer();
    }

    this.setState({
      sliderWrapperWidth,
      visibleSlidesAmount,
      totalSlidesAmount,
      children,
      slideWidth,
      slidesOffset: 0,
    });
  }

  handleSlide = (direction: 'prev' | 'next') => {
    const {
      infinity,
      autoplaySpeed,
      animationSpeed,
      slidesToShow,
    } = this.props;
    const {
      visibleSlidesAmount,
      slidesOffset,
      totalSlidesAmount,
      num,
      isTransition,
      slideWidth,
    } = this.state;

    if (isTransition) { return; }

    if (autoplaySpeed) { this.activateAutoplayTimer(); }

    const possibleOffset = ((totalSlidesAmount - visibleSlidesAmount) + 1) * slideWidth;

    if (!infinity &&
      ((slidesOffset >= 0 && direction === 'prev') ||
      (-possibleOffset >= (slidesOffset - slideWidth) && direction === 'next'))) {
      return;
    }

    let newNum = direction === 'next' ? num + 1 : num - 1;
    if (direction === 'next') {
      newNum = newNum === totalSlidesAmount ? 0 : newNum;
    } else {
      newNum = newNum === -1 ? totalSlidesAmount - 1 : newNum;
    }

    const newSlidesOffset = direction === 'next' ? slidesOffset - slideWidth : slidesOffset + slideWidth;

    if (infinity) {
      if (slidesToShow !== 1) {
        this.swapArray(direction, newNum);
      } else {
        this.singleSliderSwapArray(direction, newNum);
      }
    } else {
      this.setState({
        slidesOffset: newSlidesOffset,
        isTransition: true,
        num: newNum,
      });
      this.startAnimation();
    }

    if (this.animationTimer) { clearTimeout(this.animationTimer); }
    this.animationTimer = setTimeout(this.endAnimation, animationSpeed);
  }

  handleDot = (dotIdx: number) => {
    const { animationSpeed, autoplaySpeed } = this.props;
    const {
      num,
      slidesOffset,
      isTransition,
      slideWidth,
    } = this.state;

    if (isTransition) { return; }
    if (autoplaySpeed) { this.activateAutoplayTimer(); }

    let direction = null;
    if (dotIdx > num) { direction = 'next'; }
    if (dotIdx < num) { direction = 'prev'; }
    if (!direction) return;

    const count = direction === 'prev' ? num - dotIdx : dotIdx - num;

    this.setState({
      num: dotIdx,
      slidesOffset: direction === 'next' ? slidesOffset - (slideWidth * count) : slidesOffset + (slideWidth * count),
    });

    this.startAnimation();

    if (this.animationTimer) { clearTimeout(this.animationTimer); }
    this.animationTimer = setTimeout(this.endAnimation, animationSpeed);
  }

  startAnimation = () => {
    this.setState({ isTransition: true });
  };

  endAnimation = () => {
    this.setState({ isTransition: false });
  };

  singleSliderSwapArray = (direction: string, newNum: number) => {
    const {
      children,
      slidesOffset,
      totalSlidesAmount,
      slideWidth,
    } = this.state;

    let newChildren = children;
    let newSlidesOffset = slidesOffset;

    if (direction === 'prev' && newNum === totalSlidesAmount - 1) {
      const lastItem = last(children);
      const slicedItems = slice(0, totalSlidesAmount - 1, children);
      newChildren = prepend(lastItem, slicedItems);
      newSlidesOffset = slidesOffset - slideWidth;
    }
    if (direction === 'next' && newNum === 0) {
      const firstItem = head(children);
      const slicedItems = slice(1, totalSlidesAmount, children);
      newChildren = append(firstItem, slicedItems);
      newSlidesOffset = slidesOffset + slideWidth;
    }

    this.setState(() => ({
      slidesOffset: newSlidesOffset,
      num: newNum,
      children: newChildren,
    }), () => {
      this.animationAndMoveTimer = setTimeout(() => {
        this.startAnimation();
        this.setState(() => ({
          slidesOffset: direction === 'next' ? newSlidesOffset - slideWidth : newSlidesOffset + slideWidth,
        }));
      }, 0);
    });

    this.activateRefreshArray(direction, newNum);
  };

  swapArray = (direction: string, newNum: number) => {
    const {
      children,
      slidesOffset,
      totalSlidesAmount,
      slideWidth,
    } = this.state;

    let newChildren = children;
    let newSlidesOffset = slidesOffset;

    if (direction === 'prev') {
      const lastItem = last(children);
      const slicedItems = slice(0, totalSlidesAmount - 1, children);
      newChildren = prepend(lastItem, slicedItems);
      newSlidesOffset = slidesOffset - slideWidth;
    }
    if (direction === 'next') {
      this.activateRefreshArray(direction, newNum);
    }

    this.setState(() => ({
      slidesOffset: newSlidesOffset,
      num: newNum,
      children: newChildren,
    }), () => {
      this.animationAndMoveTimer = setTimeout(() => {
        this.startAnimation();
        this.setState(() => ({
          slidesOffset: direction === 'next' ? newSlidesOffset - slideWidth : newSlidesOffset + slideWidth,
        }));
      }, 0);
    });
  };

  activateRefreshArray = (direction: string, newNum: number) => {
    const { animationSpeed } = this.props;
    const refreshArray = () => { this.refreshArray(direction, newNum); };

    if (this.refreshArrayTimer) { clearTimeout(this.refreshArrayTimer); }
    this.refreshArrayTimer = setTimeout(refreshArray, animationSpeed);
  }

  refreshArray = (direction: string, newNum: number) => {
    const { slidesToShow } = this.props;
    const {
      children,
      slidesOffset,
      totalSlidesAmount,
      slideWidth,
    } = this.state;

    let newChildren = children;
    let newSlidesOffset = slidesOffset;

    if (direction === 'prev' && newNum === totalSlidesAmount - 1) {
      const firstItem = head(children);
      const slicedItems = slice(1, totalSlidesAmount, children);
      newChildren = append(firstItem, slicedItems);
      newSlidesOffset = -(slideWidth * (totalSlidesAmount - 1));
    }
    if (direction === 'next' && newNum === 0) {
      const lastItem = last(children);
      const slicedItems = slice(0, totalSlidesAmount - 1, children);
      newChildren = prepend(lastItem, slicedItems);
      newSlidesOffset = 0;
    }
    if (direction === 'next' && slidesToShow > 1) {
      const firstItem = head(children);
      const slicedItems = slice(1, totalSlidesAmount, children);
      newChildren = append(firstItem, slicedItems);
      newSlidesOffset = 0;
    }

    this.setState({
      slidesOffset: newSlidesOffset,
      num: newNum,
      children: newChildren,
    });
  };

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
