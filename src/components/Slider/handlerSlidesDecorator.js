// @flow

import React, { Component } from 'react';
import { head, last, slice, append, prepend } from 'ramda';

type PropsType = {
  slidesToShow: number,
  responsive: Object, // Match the breakpoint to the number of slides
  children: Array<{}>,
  infinity: ?boolean,
  autoplaySpeed: ?number,
  animationSpeed: number,
};

type StateType = {
  sliderWrapperWidth: number,
  visibleSlidesAmount: number,
  totalSlidesAmount: number,
  slidesOffset: number,
  num: number,
  children: Array<{}>,
  isTransition: boolean,
  slideWidth: number,
  isClick: boolean,
};

export default (OriginalComponent: any) =>
  class HandlerSlideDecorator extends Component<PropsType, StateType> {
  state = {
    sliderWrapperWidth: 0,
    visibleSlidesAmount: 0,
    totalSlidesAmount: 0,
    slidesOffset: 0,
    num: 0,
    children: [],
    isTransition: false,
    slideWidth: 0,
    isClick: false,
  };

  componentDidMount() {
    this.sliderPropsCalc(this.props.children);
    if (process.env.BROWSER) {
      if (document.body) {
        document.body.onresize = () => {
          this.sliderPropsCalc(this.props.children);
        };
      }
    }
  }

  componentWillReceiveProps(nextProps: PropsType) {
    if (this.props.children && this.props.children.length !== nextProps.children.length) {
      this.sliderPropsCalc(nextProps.children);
    }
  }

  componentWillUnmount() {
    if (process.env.BROWSER) {
      if (document.body) {
        document.body.onresize = null;
      }
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
    if (this.refreshTimer) {
      clearTimeout(this.animationAndMoveTimer);
    }
  }

  autoplayInterval: IntervalID;
  animationTimer: TimeoutID;
  refreshArrayTimer: TimeoutID;
  animationAndMoveTimer: TimeoutID;
  refreshTimer: TimeoutID;
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

  sliderPropsCalc = (children: Array<{}>) => {
    const {
      infinity,
      slidesToShow,
      responsive,
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
    } = this.props;
    const {
      visibleSlidesAmount,
      slidesOffset,
      totalSlidesAmount,
      num,
      slideWidth,
      isClick,
    } = this.state;

    if (isClick) { return; }

    if (autoplaySpeed) { this.activateAutoplayTimer(); }

    let newNum = direction === 'next' ? num + 1 : num - 1;
    if (direction === 'next') {
      newNum = newNum === totalSlidesAmount ? 0 : newNum;
    } else {
      newNum = newNum === -1 ? totalSlidesAmount - 1 : newNum;
    }

    if (!infinity &&
       ((direction === 'prev' && newNum === totalSlidesAmount - 1) ||
       (direction === 'next' && (newNum + visibleSlidesAmount) > totalSlidesAmount))) {
      return;
    }

    const newSlidesOffset = direction === 'next' ? slidesOffset - slideWidth : slidesOffset + slideWidth;

    if (infinity) {
      this.swapArray(direction, newNum);
      this.setState({ isClick: true });
    } else {
      this.startAnimation();
      this.setState({
        slidesOffset: newSlidesOffset,
        num: newNum,
      });
      this.startAnimation();
    }
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
    this.setState({ isTransition: false, isClick: false });
  };

  swapArray = (direction: string, newNum: number) => {
    const {
      children,
      slidesOffset,
      totalSlidesAmount,
      slideWidth,
    } = this.state;

    const { animationSpeed } = this.props;

    let newChildren = children;
    let newSlidesOffset = slidesOffset;

    if (direction === 'prev') {
      const lastItem = last(children);
      const slicedItems = slice(0, totalSlidesAmount - 1, children);
      newChildren = prepend(lastItem, slicedItems);
      newSlidesOffset = slidesOffset - slideWidth;
    }

    this.setState(() => ({
      slidesOffset: newSlidesOffset,
      num: newNum,
      children: newChildren,
    }), () => {
      this.animationAndMoveTimer = setTimeout(() => {
        if (direction === 'prev') {
          if (this.animationTimer) { clearTimeout(this.animationTimer); }
          this.animationTimer = setTimeout(this.endAnimation, animationSpeed);
        }
        this.startAnimation();
        this.setState(() => ({
          slidesOffset: direction === 'next' ? -slideWidth : 0,
        }));
        this.refreshTimer = setTimeout(() => {
          if (direction === 'next') {
            this.activateRefreshArray(direction, newNum);
          }
        }, 0);
      }, 0);
    });
  };

  activateRefreshArray = (direction: string, newNum: number) => {
    const { animationSpeed } = this.props;
    const refreshArray = () => { this.refreshArray(direction, newNum); };

    if (this.refreshArrayTimer) { clearTimeout(this.refreshArrayTimer); }
    this.refreshArrayTimer = setTimeout(() => {
      refreshArray();
      this.endAnimation();
    }, animationSpeed);
  }

  refreshArray = (direction: string, newNum: number) => {
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
    if (direction === 'next') {
      const firstItem = head(children);
      const slicedItems = slice(1, totalSlidesAmount, children);
      newChildren = append(firstItem, slicedItems);
      newSlidesOffset = 0;
    }

    this.setState({
      slidesOffset: newSlidesOffset,
      num: newNum,
      children: newChildren,
      isClick: false,
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
      >
        {this.state.children}
      </OriginalComponent>
    );
  }
}; // eslint-disable-line
