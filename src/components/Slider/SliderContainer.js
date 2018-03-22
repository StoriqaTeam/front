// @flow

import React, { Component, Children, cloneElement } from 'react';
import type { Node } from 'react';

import { SliderHeader } from 'components/Slider';

import handlerSlide from './handlerSlidesDecorator';
import './SliderContainer.scss';

type PropsTypes = {
  type: 'most-popular' | 'sale' | 'smart-reviews',
  title: string,
  showAllSlides: boolean,
  slidesOffset: number,
  visibleSlidesAmount: number,
  totalSlidesAmount: number,
  handleSlide: Function,
  originalComponentRef: Function,
  children: Node,
  isTransition: boolean,
};

class SliderContainer extends Component<PropsTypes> {
  render() {
    const {
      type,
      title,
      showAllSlides,
      slidesOffset,
      visibleSlidesAmount,
      totalSlidesAmount,
      handleSlide,
      isTransition,
    } = this.props;
    const slideWidth = 100 / visibleSlidesAmount;
    const isRevealButton = visibleSlidesAmount < totalSlidesAmount;

    return (
      <div styleName="container">
        <SliderHeader
          type={type}
          title={title}
          isRevealButton={isRevealButton}
          showAllSlides={showAllSlides}
          handleSlide={handleSlide}
        />
        <div
          ref={this.props.originalComponentRef}
          styleName="wrapper"
          style={{
            left: slidesOffset || '',
            whiteSpace: showAllSlides ? 'nowrap' : 'nowrap',
            transition: isTransition ? 'left 0.5s ease-out' : '',
          }}
        >
          {Children.map(this.props.children, (child, idx) => {
            return (
              <div
                styleName="item"
                style={{
                  width: `${slideWidth}%`,
                }}
              >
                {cloneElement(child)}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default handlerSlide(SliderContainer);
