// @flow

import React, { Component, Children, cloneElement } from 'react';
import classNames from 'classnames';
import type { Node } from 'react';

import { SliderHeader } from 'components/Slider';

import handlerSlide from './handlerSlidesDecorator';
import './SliderContainer.scss';

type PropsTypes = {
  type: string, // Slider type, for example: banners, product card etc.
  title: string, // Title for product card header
  slidesToShow: number, // Number of displayed slides
  animationSpeed: ?number, // Animation speed (ms), default: 500ms
  dots: ?boolean, // Has dots navigation
  slidesOffset: number,
  visibleSlidesAmount: number,
  totalSlidesAmount: number,
  handleSlide: Function,
  originalComponentRef: Function,
  children: Node,
  isTransition: boolean,
  handleDot: Function,
  num: number,
  seeAllUrl: ?string,
};

class SliderContainer extends Component<PropsTypes> {
  render() {
    const {
      type,
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
      dots,
      seeAllUrl,
    } = this.props;
    const slideWidth = 100 / visibleSlidesAmount;
    const isRevealButton = visibleSlidesAmount < totalSlidesAmount;
    const animationSpeedSec = animationSpeed ? animationSpeed / 1000 : 0.5;

    return (
      <div styleName="container">
        {type === 'products' && <SliderHeader
          title={title}
          isRevealButton={isRevealButton}
          handleSlide={handleSlide}
          seeAllUrl={seeAllUrl}
        />}
        <div
          ref={this.props.originalComponentRef}
          styleName="wrapper"
          style={{
            left: slidesOffset || '',
            transition: isTransition ? `left ${animationSpeedSec}s ease-out` : '',
            animationDelay: '.2s',
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
        {dots && slidesToShow === 1 &&
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
