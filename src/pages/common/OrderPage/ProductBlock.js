// @flow

import React, { PureComponent } from 'react';
import { slice } from 'ramda';
import { Link } from 'found';

import { Icon } from 'components/Icon';
import { formatPrice } from 'utils';

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
          {product.photoUrl ? (
            <img src={product.photoUrl} alt="" styleName="photo" />
          ) : (
            <div styleName="emptyLogo">
              <Icon type="camera" size={40} />
            </div>
          )}
        </div>
        <div styleName="productInfoBlock">
          <div styleName="productName">
            <Link to={`/store/${product.storeId}/products/${product.id}`}>
              <strong styleName="productNameText">{product.name}</strong>
            </Link>
          </div>
          <div styleName="productCategory">
            <Link to={`/categories?category=${product.category.id}&search=`}>
              {product.category.name}
            </Link>
          </div>
          <div styleName="productPrice">
            {formatPrice(product.price)} <strong>STQ</strong>
          </div>
        </div>
        {this.renderAttributes(attributes)}
      </div>
    );
  }
}

export default ProductBlock;
