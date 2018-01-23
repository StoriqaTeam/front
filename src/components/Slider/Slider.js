import React, { PureComponent } from 'react';

import { SliderContainer, Slide } from 'components/Slider';
import { CardProduct } from 'components/CardProduct';

class Slider extends PureComponent {
  render() {
    return (
      <div className="Slider">
        <SliderContainer {...this.props}>
          {this.props.items.map(item => ( // eslint-disable-line
            <CardProduct
              key={item.id}
              data={item}
            />
          ))}
        </SliderContainer>
      </div>
    );
  }
}

export default Slider;
