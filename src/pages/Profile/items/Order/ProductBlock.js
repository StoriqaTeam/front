// @flow

import React, { PureComponent } from 'react';
import { slice } from 'ramda';
import { Link } from 'found';

import './ProductBlock.scss';

export type ProductDTOType = {
  id: string,
  storeId: number,
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
      {attributes.map((item, idx) => (
        // eslint-disable-next-line
        <div styleName="attributeWrapper" key={`order-attribute-${idx}`}>
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
            <Link to={`/store/${product.storeId}/products/${product.id}`}>
              <b>{product.name}</b>
            </Link>
          </div>
          <div styleName="productCategory">
            <Link to={`/categories?category=${product.category.id}&search=`}>
              {product.category.name}
            </Link>
          </div>
          <div styleName="productPrice">
            {product.price} <b>STQ</b>
          </div>
        </div>
        {this.renderAttributes(attributes)}
      </div>
    );
  }
}

export default ProductBlock;
