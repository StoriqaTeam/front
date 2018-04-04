// @flow

import React from 'react';

import './ProductThumbnails.scss';

type propsTypes = {
  thumbnails: {img: string, alt: string}[],
}

const ProductThumbnails = (props: propsTypes) => {
  const { thumbnails } = props;
  return (
    <div styleName="container">
      {thumbnails.map(({ src, alt }) => (
        <img
          src={src}
          alt={alt}
        />
      ))}
    </div>
  );
};

export default ProductThumbnails;
