// @flow

import React, { PureComponent } from 'react';

import { extractText, extractAttributes } from 'utils';

import {
  ProductContext,
  ProductPrice,
  ProductSize,
  ProductMaterial,
  ProductThumbnails,
} from './index';

import './ProductDetails.scss';

type MaterialType = {id: string | number, label: string}

type StateType = {
  sizes: string | number[],
  selected: MaterialType,
  materials: MaterialType[],
  thumbnails: {id: string | number, img: string, alt: string}[],
}

class ProductDetails extends PureComponent<{}, StateType> {
  state = {
    selected: null,
    materials: [
      { id: '1', label: 'BTC' },
      { id: '2', label: 'ETH' },
      { id: '3', label: 'STQ' },
      { id: '4', label: 'ADA' },
      { id: '5', label: 'NEM' },
      { id: '6', label: 'STRAT' },
    ],
    thumbnails: [
      {
        id: 0,
        src: 'https://www.flightclub.com/media/catalog/product/cache/1/image/1600x1140/9df78eab33525d08d6e5fb8d27136e95/8/0/801640_1.jpg',
        alt: 'air jordan sideways',
      },
      {
        id: 1,
        src: 'https://www.studio-88.co.za/wp-content/uploads/2017/10/NIKE-JORDAN-AIR-JORDAN-1-MID-BLACK-BLACK-NKK961BP-V4.jpg',
        alt: 'air jordan front',
      },
      {
        id: 2,
        src: 'https://cdn.thesolesupplier.co.uk/2017/09/Nike-Air-Jordan-1-Mid-Triple-Black-03.jpeg',
        alt: 'air jordan back',
      },
      {
        id: 3,
        src: 'https://images.ua.prom.st/935779920_w640_h640_air_jordan_1_m__01_696x489.jpg',
        alt: 'air jordan back right',
      },
    ],
  };
  /**
   * @param {MaterialType} selected
   * @return {void}
   */
  handleSelected = (selected: MaterialType): void => {
    this.setState({ selected });
  };
  render() {
    const {
      materials,
      selected,
      thumbnails,
    } = this.state;
    return (
      <ProductContext.Consumer>
        {(context) => {
          const {
            baseProductWithVariants: {
              baseProduct: {
                name,
                longDescription,
              },
              variants,
            },
          } = context;
          const [size] = extractAttributes(variants, 'Size');
          return (
            <div styleName="container">
              <h2>{ extractText(name) }</h2>
              <ProductPrice
                lastPrice="0.000290"
                currentPrice="0.000123"
                percentage="12"
              />
              <p>
                { extractText(longDescription, 'EN', 'Нет описания') }
              </p>
              <ProductSize
                title={size.name}
                sizes={size.values}
              />
              <ProductMaterial
                selected={selected || materials[0]}
                materials={materials}
                onSelect={this.handleSelected}
              />
              <ProductThumbnails
                title="Цвет"
                row
                thumbnails={thumbnails}
              />
            </div>
          );
        }}
      </ProductContext.Consumer>
    );
  }
}

export default ProductDetails;
