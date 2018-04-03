// @flow

import React, { PureComponent } from 'react';

import './ProductThumbnails.scss';

type propsTypes = {
  thumbnails: {img: string, alt: string}[],
}

class ProductThumbnails extends PureComponent<propsTypes> {
  handleLightBox = {};
  render() {
    const { thumbnails } = this.props;
    return (
      <div styleName="container">
        {thumbnails.map(({ src, alt }) => (
          <img src={src} alt={alt} />
        ))}
      </div>
    );
  }
}

export default ProductThumbnails;
