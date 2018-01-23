// @flow

import React, { Component, Children, cloneElement } from 'react';
import type { Node } from 'react';

import { SliderHeader } from 'components/Slider';

import handlerSlide from './handlerSlidesDecorator';

type PropsTypes = {
  color: string,
  title: string,
  showAllSlides: boolean,
  slidesOffset: number,
  visibleSlidesAmount: number,
  totalSlidesAmount: number,
  handleSlide: Function,
  originalComponentRef: Function,
  children: Node,
};

class SliderContainer extends Component<PropsTypes> {
  render() {
    const {
      color,
      title,
      showAllSlides,
      slidesOffset,
      visibleSlidesAmount,
      totalSlidesAmount,
      handleSlide,
    } = this.props;
    const slideWidth = 100 / visibleSlidesAmount;
    const isRevealButton = visibleSlidesAmount < totalSlidesAmount;

    return (
      <div className="SliderContainer">
        <SliderHeader
          color={color}
          title={title}
          isRevealButton={isRevealButton}
          showAllSlides={showAllSlides}
          handleSlide={handleSlide}
        />
        <div
          ref={this.props.originalComponentRef}
          className="SliderContainer--wrapper"
          style={{
            left: slidesOffset,
            whiteSpace: showAllSlides ? 'normal' : 'nowrap',
          }}
        >
          {Children.map(this.props.children, child => (
            <div
              className="SliderContainer--wrapper--item"
              style={{
                width: `${slideWidth}%`,
              }}
            >
              {cloneElement(child)}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default handlerSlide(SliderContainer);
