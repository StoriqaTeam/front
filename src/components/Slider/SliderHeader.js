import React, { PureComponent } from 'react';

import './SliderHeader.scss';

type PropsTypes = {
  color: number,
  title: string,
  isRevealButton: boolean,
  showAllSlides: boolean,
  handleSlide: Function,
};

class SliderHeader extends PureComponent<PropsTypes> {
  render() {
    const {
      color,
      title,
      isRevealButton,
      showAllSlides,
      handleSlide,
    } = this.props;

    return (
      <div styleName="sliderHeader">
        <div styleName="title" style={{ color }}>{title}</div>
        {isRevealButton &&
        <a
          href="#"
          styleName="reveal"
          style={{ color }}
        >
          See all
        </a>
        }
        {isRevealButton && !showAllSlides &&
        <div styleName="nav">
          <button
            direction="prev"
            styleName="nav-button"
            onClick={() => handleSlide('prev')}
          >
            <img
              src={/* eslint-disable */require('assets/img/prev-button-icon.svg')/* eslint-enable */}
              alt="prev"
            />
          </button>
          <button
            direction="next"
            styleName="nav-button"
            onClick={() => handleSlide('next')}
          >
            <img
              src={/* eslint-disable */require('assets/img/next-button-icon.svg')/* eslint-enable */}
              alt="next"
            />
          </button>
        </div>
        }
      </div>
    );
  }
}

export default SliderHeader;
