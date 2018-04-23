// @flow

import React, { PureComponent } from 'react';

import { isEmpty } from 'utils';

import { ProductThumbnails, ImageDetail } from './index';

import Expand from './svg/expand.svg';

import './ProductImage.scss';

type PropsType = {
  mainImage: string,
  thumbnails: Array<string>,
}

type StateType = {
  thumbnails: {id: string | number, img: string, alt: string}[],
  selectedImage: {src: string, alt: string },
}

class ProductImage extends PureComponent<PropsType, StateType> {
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
    selectedImage: {},
  };
  /**
   * Sets the clicked image as the big one.
   * @param {string} selectedImage
   * @return {void}
   */
  handleClick = (selectedImage: string): void => {
    this.setState({ selectedImage });
  };
  render() {
    const { thumbnails, selectedImage } = this.state;
    return (
      <div styleName="container">
        <div styleName="thumbnailsWrapper">
          {1 ? (
            <ProductThumbnails
              onClick={this.handleClick}
              thumbnails={thumbnails}
            />
          ) : null}
        </div>
        <figure styleName="bigImage">
          <span styleName="expand">
            <Expand />
          </span>
          <img
            src={!isEmpty(selectedImage) ? selectedImage.src : 'https://blog.stylingandroid.com/wp-content/themes/lontano-pro/images/no-image-slide.png'}
            alt=""
          />
          <ImageDetail />
        </figure>
      </div>
    );
  }
}

export default ProductImage;
