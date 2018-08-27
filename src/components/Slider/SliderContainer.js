// @flow

import React, { Component, Children, cloneElement } from 'react';
import classNames from 'classnames';
import type { Node } from 'react';

import { SliderHeader } from 'components/Slider';
import { Icon } from 'components/Icon';

import handlerSlide from './handlerSlidesDecorator';
import './SliderContainer.scss';

type PropsTypes = {
  type: string, // Slider type, for example: banners, product card etc.
  title: string, // Title for product card header
  slidesToShow: number, // Number of displayed slides
  animationSpeed?: number, // Animation speed (ms), default: 500ms
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
  fade?: boolean,
  dotIdx?: boolean,
  arrows?: boolean,
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
      fade,
      dotIdx,
      arrows,
    } = this.props;
    const slideWidth = 100 / visibleSlidesAmount;
    const isRevealButton = visibleSlidesAmount < totalSlidesAmount;
    const animationSpeedSec = animationSpeed ? animationSpeed / 1000 : 0.5;

    return (
      <div styleName="container">
        {arrows && (
          <span styleName="leftArrow">
            <Icon type="leftArrowSlider" size={28} />
          </span>
        )}
        {arrows && (
          <span styleName="rightArrow">
            <Icon type="rightArrowSlider" size={28} />
          </span>
        )}
        {type === 'products' && (
          <SliderHeader
            title={title}
            isRevealButton={isRevealButton}
            handleSlide={handleSlide}
            seeAllUrl={seeAllUrl}
          />
        )}
        <div
          ref={this.props.originalComponentRef}
          styleName="wrapper"
          style={{
            left: slidesOffset || '',
            transition:
              isTransition && !fade
                ? `left ${animationSpeedSec}s ease-out`
                : '',
            animationDelay: fade ? '' : '.2s',
          }}
        >
          {Children.map(this.props.children, child => (
            <div
              styleName={classNames('item', {
                fadeItem: fade,
                activeSlide: dotIdx === child.key - 1,
                image: (type === 'image'),
              })}
              style={{
                width: `${slideWidth}%`,
              }}
            >
              {cloneElement(child)}
            </div>
          ))}
        </div>
        {dots &&
          slidesToShow === 1 && (
            <div styleName="dots">
              {Children.map(this.props.children, (child, idx) => (
                <div
                  styleName={classNames('dot', { active: idx === num })}
                  onClick={() => {
                    handleDot(idx);
                  }}
                  onKeyDown={() => {}}
                  role="button"
                  tabIndex="0"
                />
              ))}
            </div>
          )}
      </div>
    );
  }
}

export default handlerSlide(SliderContainer);
