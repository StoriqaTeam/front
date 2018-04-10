// @flow

import React, { PureComponent } from 'react';
import { map } from 'ramda';

import { Slider } from 'components/Slider';

import './GoodsSlider.scss';

type PropsTypes = {
  items: Array<{
    node: {
      baseProduct: {
        name: {
          lang: string,
          text: string,
        },
        currencyId: string,
      },
      variants: {
        discount: string,
        photoMain: string,
        cashback: string,
        price: string,
      },
    }
  }>,
  title: string,
};

class GoodsSlider extends PureComponent<PropsTypes> {
  render() {
    const { items, title } = this.props;
    return (
      <div styleName="container">
        <Slider
          infinity
          animationSpeed={500}
          title={title}
          type="products"
          items={map(item => item.node, items)}
          slidesToShow={4}
        />
      </div>
    );
  }
}

export default GoodsSlider;
