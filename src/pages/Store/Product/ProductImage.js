// @flow

import React, { PureComponent } from 'react';

import { ProductThumbnails } from 'pages/Store/Product';

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
    ],
  };
  render() {
    const { thumbnails } = this.state;
    return (
      <div styleName="container">
        <ProductThumbnails thumbnails={thumbnails} />
        <img
          src="https://www.studio-88.co.za/wp-content/uploads/2017/10/NIKE-JORDAN-AIR-JORDAN-1-MID-BLACK-BLACK-NKK961BP-V4.jpg"
          alt="nike air jordan"
        />
      </div>
    );
  }
}

export default ProductImage;
