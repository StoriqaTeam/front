import React, { PureComponent } from 'react';

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
      <div className="SliderHeader">
        <div className="SliderHeader--title" style={{ color }}>{title}</div>
        {isRevealButton &&
        <a
          href="#"
          className="SliderHeader--reveal"
          style={{ color }}
        >
          See all
        </a>
        }
        {isRevealButton && !showAllSlides &&
        <div className="SliderHeader--nav">
          <button
            direction="prev"
            className="SliderHeader--nav--button SliderHeader--nav--button-prev"
            onClick={() => handleSlide('prev')}
          >
            <img
              src={/* eslint-disable */require('assets/img/prev-button-icon.svg')/* eslint-enable */}
              alt="prev"
            />
          </button>
          <button
            direction="next"
            className="SliderHeader--nav--button SliderHeader--nav--button-next"
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
