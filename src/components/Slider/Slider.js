import React, { PureComponent } from 'react';

import { SliderContainer } from 'components/Slider';
import { CardProduct } from 'components/CardProduct';

import './Slider.scss';

type PropsTypes = {
  items: Array<{}>,
};

class Slider extends PureComponent<PropsTypes> {
  render() {
    return (
      <div styleName="container">
        <SliderContainer {...this.props}>
          {this.props.items.map(item => (
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
