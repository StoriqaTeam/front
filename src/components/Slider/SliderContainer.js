// @flow

import React, { Component, Children, cloneElement } from 'react';
import classNames from 'classnames';
import type { Node } from 'react';

import { SliderHeader } from 'components/Slider';

import handlerSlide from './handlerSlidesDecorator';
import './SliderContainer.scss';

type PropsTypes = {
  type: string,
  headerType: 'most-popular' | 'sale' | 'smart-reviews',
  title: string,
  slidesOffset: number,
  visibleSlidesAmount: number,
  totalSlidesAmount: number,
  handleSlide: Function,
  originalComponentRef: Function,
  children: Node,
  isTransition: boolean,
  slidesToShow: number,
  handleDot: Function,
  num: number,
  animationSpeed: ?number,
  isDots: ?boolean,
};

class SliderContainer extends Component<PropsTypes> {
  render() {
    const {
      type,
      headerType,
      title,
      slidesOffset,
      visibleSlidesAmount,
      totalSlidesAmount,
      handleSlide,
      isTransition,
      handleDot,
      slidesToShow,
      num,
      animationSpeed,
      isDots,
    } = this.props;
    const slideWidth = 100 / visibleSlidesAmount;
    const isRevealButton = visibleSlidesAmount < totalSlidesAmount;
    const animationSpeedSec = animationSpeed ? animationSpeed / 1000 : 0.5;

    return (
      <div styleName="container">
        {type === 'products' && <SliderHeader
          type={headerType}
          title={title}
          isRevealButton={isRevealButton}
          handleSlide={handleSlide}
        />}
        <div
          ref={this.props.originalComponentRef}
          styleName="wrapper"
          style={{
            left: slidesOffset || '',
            transition: isTransition ? `left ${animationSpeedSec}s ease-out` : '',
          }}
        >
          {Children.map(this.props.children, child => (
            <div
              styleName="item"
              style={{
                width: `${slideWidth}%`,
              }}
            >
              {cloneElement(child)}
            </div>
          ))}
        </div>
        {isDots && slidesToShow === 1 &&
          <div styleName="dots">
            {Children.map(this.props.children, (child, idx) => (
              <div
                styleName={classNames('dot', { active: idx === num })}
                onClick={() => { handleDot(idx); }}
                onKeyDown={() => {}}
                role="button"
                tabIndex="0"
              />
            ))}
          </div>
        }
      </div>
    );
  }
}

export default handlerSlide(SliderContainer);
