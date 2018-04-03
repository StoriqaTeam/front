// @flow

import React, { PureComponent } from 'react';

import './ProductThumbnails.scss';

class ProductThumbnails extends PureComponent<{}> {
  handleLightBox = {};
  render() {
    return (
      <div styleName="container">
        <img
          src="https://www.studio-88.co.za/wp-content/uploads/2017/10/NIKE-JORDAN-AIR-JORDAN-1-MID-BLACK-BLACK-NKK961BP-V4.jpg"
          alt="nike air jordan"
        />
      </div>
    );
  }
}

export default ProductThumbnails;
