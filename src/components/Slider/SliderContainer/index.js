import React, { PureComponent, Children, cloneElement } from 'react';
import PropTypes from 'prop-types';

import handlerSlide from './handlerSlidesDecorator';

import SliderHeader from '../SliderHeader';

class SliderContainer extends PureComponent {
  render() {
    const {
      color,
      title,
      showAllSlides,
      slidesOffset,
      visibleSlidesAmount,
      totalSlidesAmount,
      handlerShowSlides,
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
          handlerShowSlides={handlerShowSlides}
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
          {Children.map(this.props.children, child => cloneElement(child, { slideWidth }))}
        </div>
      </div>
    );
  }
}

SliderContainer.propTypes = {
  color: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  showAllSlides: PropTypes.bool.isRequired,
  slidesOffset: PropTypes.number.isRequired,
  visibleSlidesAmount: PropTypes.number.isRequired,
  totalSlidesAmount: PropTypes.number.isRequired,
  handlerShowSlides: PropTypes.func.isRequired,
  handleSlide: PropTypes.func.isRequired,
  originalComponentRef: PropTypes.func.isRequired,
  children: PropTypes.array.isRequired, // eslint-disable-line
};

export default handlerSlide(SliderContainer);
