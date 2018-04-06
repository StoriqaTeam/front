// @flow

import React, { PureComponent } from 'react';

import { ProductThumbnails, ImageDetail } from 'pages/Store/Product';

import Expand from './svg/expand.svg';

import './ProductImage.scss';

type stateTypes = {
  thumbnails: {id: string | number, img: string, alt: string}[],
  selectedImage: string,
}

class ProductImage extends PureComponent<{}, stateTypes> {
  state = {
    thumbnails: [
      {
        id: 0,
        src: 'https://images.solecollector.com/complex/image/upload/f2ojbxfvdy6hwb039sru.jpg',
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
    selectedImage: null,
  };
  render() {
    const { thumbnails, selectedImage } = this.state;
    return (
      <div styleName="container">
        <div styleName="thumbnailsWrapper">
          <ProductThumbnails
            thumbnails={thumbnails}
          />
        </div>
        <figure styleName="bigImage">
          <span styleName="expand">
            <Expand />
          </span>
          <img
            src={selectedImage || thumbnails[0].src}
            alt="nike air jordan"
          />
          <ImageDetail />
        </figure>
      </div>
    );
  }
}

export default ProductImage;
