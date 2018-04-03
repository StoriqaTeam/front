// @flow

import React, { PureComponent } from 'react';

import { ProductThumbnails } from 'pages/Store/Product';

import Zoom from './svg/zoom.svg';
import Expand from './svg/expand.svg';

import './ProductImage.scss';

type stateTypes = {
  thumbnails: {img: string, alt: string}[],
}

class ProductImage extends PureComponent<{}, stateTypes> {
  state = {
    thumbnails: [
      {
        src: 'https://www.flightclub.com/media/catalog/product/cache/1/image/1600x1140/9df78eab33525d08d6e5fb8d27136e95/8/0/801640_1.jpg',
        alt: 'air jordan sideways',
      },
      {
        src: 'https://www.studio-88.co.za/wp-content/uploads/2017/10/NIKE-JORDAN-AIR-JORDAN-1-MID-BLACK-BLACK-NKK961BP-V4.jpg',
        alt: 'air jordan front',
      },
      {
        src: 'https://cdn.thesolesupplier.co.uk/2017/09/Nike-Air-Jordan-1-Mid-Triple-Black-03.jpeg',
        alt: 'air jordan back',
      },
      {
        src: 'https://images.ua.prom.st/935779920_w640_h640_air_jordan_1_m__01_696x489.jpg',
        alt: 'air jordan back right',
      },
    ],
  };
  render() {
    const { thumbnails } = this.state;
    return (
      <div styleName="container">
        <ProductThumbnails thumbnails={thumbnails} />
        <figure>
          <span styleName="expand">
            <Expand />
          </span>
          <img
            src="https://www.studio-88.co.za/wp-content/uploads/2017/10/NIKE-JORDAN-AIR-JORDAN-1-MID-BLACK-BLACK-NKK961BP-V4.jpg"
            alt="nike air jordan"
          />
          <p styleName="imageDetail">
            <span styleName="zoom">
              <Zoom />
            </span>Наведите курсором, чтобы рассмотреть детали
          </p>
        </figure>
      </div>
    );
  }
}

export default ProductImage;
