// @flow

import React, { Component } from 'react';
import {
  head,
  last,
  slice,
  append,
  prepend,
  propEq,
  findIndex,
  concat,
  equals,
} from 'ramda';

type PropsType = {
  slidesToShow: number,
  responsive: Object, // Match the breakpoint to the number of slides
  children: Array<any>,
  infinity: ?boolean,
  autoplaySpeed: ?number,
  animationSpeed: number,
  fade?: boolean,
  getValueDotIdx: (dotIdx: number) => void,
  type: string,
};

type StateType = {
  visibleSlidesAmount: number,
  totalSlidesAmount: number,
  slidesOffset: number,
  num: number,
  children: Array<any>,
  isTransition: boolean,
  slideWidth: number,
  isClick: boolean,
  previewLength: number,
  counterNum: number,
};

export default (OriginalComponent: any) =>
  class HandlerSlideDecorator extends Component<PropsType, StateType> {
    state = {
      visibleSlidesAmount: 0,
      totalSlidesAmount: 0,
      slidesOffset: 0,
      num: 0,
      children: [],
      isTransition: false,
      slideWidth: 0,
      isClick: false,
      previewLength: 3,
      counterNum: 1,
    };

    componentDidMount() {
      this.sliderPropsCalc(this.props.children);
      if (process.env.BROWSER) {
        if (document.body) {
          const { onresize } = document.body;
          document.body.onresize = () => {
            if (onresize) {
              onresize();
            }
            this.sliderPropsCalc(this.props.children);
          };
        }
      }
    }

    componentWillReceiveProps(nextProps: PropsType) {
      const { children } = this.props;
      if (
        children &&
        (children.length !== nextProps.children.length ||
          equals(children) !== equals(nextProps.children))
      ) {
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

    cropChildren = (direction?: string) => {
      const { children } = this.props;
      const {
        children: stateChildren,
        previewLength,
        slideWidth,
        visibleSlidesAmount,
      } = this.state;
      const totalSlidesAmount = children.length;
      if (!direction) {
        const firstItems = slice(
          0,
          visibleSlidesAmount + previewLength,
          children,
        );
        const lastItems = slice(
          totalSlidesAmount - previewLength,
          totalSlidesAmount,
          children,
        );
        this.setState({
          children: concat(lastItems, firstItems),
        });
      }
      if (totalSlidesAmount <= visibleSlidesAmount + 1) {
        return;
      }
      if (direction === 'prev') {
        // $FlowIgnoreMe
        const headKey = head(stateChildren).key;
        const headIdx = findIndex(propEq('key', headKey))(children);
        const newFirstItem =
          children[headIdx === 0 ? totalSlidesAmount - 1 : headIdx - 1];
        const slicedChildren = slice(
          0,
          2 * previewLength + visibleSlidesAmount - 1,
          stateChildren,
        );
        const newChildren = prepend(newFirstItem, slicedChildren);
        this.setState(prevState => ({
          children: newChildren,
          slidesOffset: prevState.slidesOffset - slideWidth,
        }));
      }
      if (direction === 'next') {
        // $FlowIgnoreMe
        const lastKey = last(stateChildren).key;
        const lastIdx = findIndex(propEq('key', lastKey))(children);
        const newLastItem =
          children[lastIdx === totalSlidesAmount - 1 ? 0 : lastIdx + 1];
        const slicedChildren = slice(
          1,
          2 * previewLength + visibleSlidesAmount,
          stateChildren,
        );
        const newChildren = append(newLastItem, slicedChildren);
        this.setState(prevState => ({
          children: newChildren,
          slidesOffset: prevState.slidesOffset + slideWidth,
        }));
      }
    };

    activateAutoplayTimer = () => {
      const { autoplaySpeed } = this.props;

      if (autoplaySpeed) {
        if (this.autoplayInterval) {
          clearInterval(this.autoplayInterval);
        }
        this.autoplayInterval = setInterval(() => {
          this.autoplayHandleDot();
        }, autoplaySpeed);
      }
    };

    autoplayHandleDot = () => {
      const { num, totalSlidesAmount } = this.state;
      this.handleDot(num === totalSlidesAmount - 1 ? 0 : num + 1);
    };

    sliderPropsCalc = (children: Array<{}>) => {
      const {
        infinity,
        slidesToShow,
        responsive,
        autoplaySpeed,
        type,
      } = this.props;
      const { previewLength } = this.state;
      const totalSlidesAmount = children.length;
      const sliderWrapperWidth = this.originalComponentElement.getBoundingClientRect()
        .width;
      let visibleSlidesAmount = slidesToShow;

      if (responsive) {
        responsive.forEach(i => {
          if (window.innerWidth < i.breakpoint) {
            visibleSlidesAmount = i.slidesToShow;
          }
        });
      }

      const slideWidth = sliderWrapperWidth / visibleSlidesAmount;

      if (
        infinity &&
        autoplaySpeed &&
        visibleSlidesAmount < totalSlidesAmount
      ) {
        this.activateAutoplayTimer();
      }

      this.setState({
        visibleSlidesAmount,
        totalSlidesAmount,
        slideWidth,
        slidesOffset:
          (slidesToShow === 1 && type === 'banners') ||
          totalSlidesAmount <= slidesToShow + 1
            ? 0
            : -previewLength * slideWidth,
      });

      if (
        (slidesToShow === 1 && type === 'banners') ||
        totalSlidesAmount <= slidesToShow + 1
      ) {
        this.setState({ children });
      } else {
        this.setState(
          prevState => {
            if (children.length <= slidesToShow + 3) {
              return {
                previewLength: 1,
                slidesOffset: -1 * slideWidth,
              };
            } else if (children.length <= slidesToShow + 6) {
              return {
                previewLength: 2,
                slidesOffset: -2 * slideWidth,
              };
            }
            return prevState;
          },
          () => {
            this.cropChildren();
          },
        );
      }
    };

    handleSlide = (direction: 'prev' | 'next') => {
      const { animationSpeed, slidesToShow } = this.props;
      const {
        slidesOffset,
        slideWidth,
        isTransition,
        totalSlidesAmount,
        counterNum,
      } = this.state;
      if (isTransition) {
        return;
      }
      if (totalSlidesAmount <= slidesToShow + 1) {
        if (
          (direction === 'prev' && slidesOffset === 0) ||
          (direction === 'next' && slidesOffset === -slideWidth)
        ) {
          return;
        }
      }
      const newSlidesOffset =
        direction === 'next'
          ? slidesOffset - slideWidth
          : slidesOffset + slideWidth;
      this.startAnimation();

      let newCounterNum =
        direction === 'next' ? counterNum + 1 : counterNum - 1;

      if (newCounterNum > totalSlidesAmount) {
        newCounterNum = 1;
      }

      if (newCounterNum === 0) {
        newCounterNum = totalSlidesAmount;
      }

      this.setState(
        {
          counterNum: newCounterNum,
          slidesOffset: newSlidesOffset,
        },
        () => {
          if (this.animationTimer) {
            clearTimeout(this.animationTimer);
          }
          this.animationTimer = setTimeout(() => {
            this.endAnimation();
            this.cropChildren(direction);
          }, animationSpeed);
        },
      );
    };

    handleDot = (dotIdx: number) => {
      const {
        animationSpeed,
        autoplaySpeed,
        fade,
        getValueDotIdx,
      } = this.props;
      const { num, slidesOffset, isTransition, slideWidth } = this.state;
      if (isTransition) {
        return;
      }
      if (autoplaySpeed) {
        this.activateAutoplayTimer();
      }

      let direction = null;
      if (dotIdx > num) {
        direction = 'next';
      }
      if (dotIdx < num) {
        direction = 'prev';
      }
      if (!direction) return;

      if (fade) {
        getValueDotIdx(dotIdx);
        this.setState({ num: dotIdx });
        return;
      }
      const count = direction === 'prev' ? num - dotIdx : dotIdx - num;

      this.setState({
        num: dotIdx,
        slidesOffset:
          direction === 'next'
            ? slidesOffset - slideWidth * count
            : slidesOffset + slideWidth * count,
      });

      this.startAnimation();

      if (this.animationTimer) {
        clearTimeout(this.animationTimer);
      }
      this.animationTimer = setTimeout(this.endAnimation, animationSpeed);
    };

    startAnimation = () => {
      this.setState(() => ({ isTransition: true }));
    };

    endAnimation = () => {
      this.setState(() => ({ isTransition: false, isClick: false }));
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

      if (direction === 'prev') {
        const lastItem = last(children);
        const slicedItems = slice(0, totalSlidesAmount - 1, children);
        newChildren = prepend(lastItem, slicedItems);
      }

      this.setState(
        () => ({
          slidesOffset:
            direction === 'next' ? slidesOffset : slidesOffset - slideWidth,
          num: newNum,
        }),
        () => {
          if (direction === 'prev') {
            this.cropChildren('prev');
            if (this.refreshTimer) {
              clearTimeout(this.refreshTimer);
            }
            this.refreshTimer = setTimeout(() => {
              this.startAnimation();
              this.setState(() => ({ slidesOffset: 0 }));
              if (this.animationTimer) {
                clearTimeout(this.animationTimer);
              }
              this.animationTimer = setTimeout(
                this.endAnimation,
                animationSpeed,
              );
            }, 50);
          }

          if (direction === 'next') {
            this.setState({ children: newChildren });
            this.startAnimation();
            if (this.refreshTimer) {
              clearTimeout(this.refreshTimer);
            }
            this.refreshTimer = setTimeout(() => {
              this.setState(() => ({ slidesOffset: -slideWidth }));
              this.activateRefreshArray(direction, newNum);
            }, 0);
          }
        },
      );
    };

    activateRefreshArray = (direction: string, newNum: number) => {
      const { animationSpeed } = this.props;
      const refreshArray = () => {
        this.refreshArray(direction, newNum);
      };

      if (this.refreshArrayTimer) {
        clearTimeout(this.refreshArrayTimer);
      }
      this.refreshArrayTimer = setTimeout(() => {
        refreshArray();
        this.endAnimation();
      }, animationSpeed);
    };

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
        this.cropChildren('next');
        newSlidesOffset = 0;
      }

      this.setState({
        slidesOffset: newSlidesOffset,
        num: newNum,
        isClick: false,
      });
      if (direction === 'prev') {
        this.setState({ children: newChildren });
      }
    };

    render() {
      return (
        <OriginalComponent
          originalComponentRef={el => {
            this.originalComponentElement = el;
          }}
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
