// @flow

import React, { PureComponent } from 'react';

import { Slider } from 'components/Slider';

import './GoodsSlider.scss';

type ProductType = {
  rawId: number,
  store: {
    rawId: number,
  },
  name: Array<{
    lang: string,
    text: string,
  }>,
  currencyId: number,
  variants: {
    first: {
      rawId: number,
      discount: number,
      photoMain: string,
      cashback: number,
      price: number,
    },
  },
  rating: number,
};

type PropsTypes = {
  items: Array<{
    node: ProductType,
  }>,
  title: string,
  seeAllUrl: ?string,
};

class GoodsSlider extends PureComponent<PropsTypes> {
  render() {
    const { items, title, seeAllUrl } = this.props;
    return (
      <div styleName="container">
        <Slider
          infinity
          animationSpeed={500}
          title={title}
          type="products"
          items={items}
          slidesToShow={4}
          seeAllUrl={seeAllUrl}
        />
      </div>
    );
  }
}

export default GoodsSlider;
