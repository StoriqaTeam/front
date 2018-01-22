import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SliderHeader extends Component {
  render() {
    const {
      color,
      title,
      isRevealButton,
      showAllSlides,
      handleSlide,
      handlerShowSlides,
    } = this.props;
    const toggleAllText = showAllSlides ? 'Hide some' : 'See all';

    return (
      <div className="SliderHeader">
        <div className="SliderHeader--title" style={{ color }}>{title}</div>
        {isRevealButton &&
        <button
          className="SliderHeader--reveal"
          onClick={handlerShowSlides}
          style={{ color }}
        >
          {toggleAllText}
        </button>
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

SliderHeader.propTypes = {
  color: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  isRevealButton: PropTypes.bool.isRequired,
  showAllSlides: PropTypes.bool.isRequired,
  handleSlide: PropTypes.func.isRequired,
  handlerShowSlides: PropTypes.func.isRequired,
};

export default SliderHeader;
