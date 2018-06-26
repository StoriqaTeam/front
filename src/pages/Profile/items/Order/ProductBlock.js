// @flow

import React, { PureComponent } from 'react';
import { slice } from 'ramda';

import './ProductBlock.scss';

export type ProductDTOType = {
  id: string,
  name: string,
  photoUrl: ?string,
  category: {
    id: string,
    name: string,
  },
  price: number,
  attributes: Array<{
    name: string,
    value: string,
  }>,
};

type PropsType = {
  product: ProductDTOType,
};

class ProductBlock extends PureComponent<PropsType> {
  renderAttributes = (
    attributes: Array<{
      name: string,
      value: string,
    }>,
  ) => (
    <div>
      {attributes.map(item => (
        <div styleName="attributeWrapper">
          <div styleName="attributeName">{item.name}</div>
          <div styleName="attributeValue">{item.value}</div>
        </div>
      ))}
    </div>
  );

  render() {
    const { product } = this.props;
    const attributes = slice(0, 3, product.attributes);
    return (
      <div styleName="container">
        <div styleName="photoWrapper">
          <img src={product.photoUrl} alt="" styleName="photo" />
        </div>
        <div styleName="productInfoBlock">
          <div styleName="productName">
            <b>{product.name}</b>
          </div>
          <div styleName="productCategory">{product.category.name}</div>
          <div styleName="productPrice">{product.price}</div>
        </div>
        {this.renderAttributes(attributes)}
      </div>
    );
  }
}

export default ProductBlock;
