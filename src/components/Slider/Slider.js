import React, { PureComponent } from 'react';

import { SliderContainer } from 'components/Slider';
import { CardProduct } from 'components/CardProduct';

import './Slider.scss';

class Slider extends PureComponent {
  render() {
    return (
      <div styleName="container">
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
