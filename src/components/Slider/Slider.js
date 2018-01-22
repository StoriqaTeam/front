import React, { Component } from 'react';

import SliderContainer from './SliderContainer';
import Slide from './Slide';

class Slider extends Component {
  render() {
    return (
      <div className="Slider">
        <SliderContainer {...this.props}>
          {this.props.items.map(item => ( // eslint-disable-line
            <Slide
              key={item.id}
              item={item}
            />
          ))}
        </SliderContainer>
      </div>
    );
  }
}

export default Slider;
