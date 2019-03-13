// @flow

import React, { PureComponent, Fragment } from 'react';
import { slice, isEmpty } from 'ramda';
import { Link } from 'found';

import { Icon } from 'components/Icon';
import { convertSrc, formatPrice } from 'utils';

import './ProductBlock.scss';

export type ProductDTOType = {
  id: string,
  rawId: ?number,
  storeId: number,
  name: string,
  photoUrl: ?string,
  category: {
    id: string,
    name: string,
  },
  attributes: Array<{
    name: string,
    value: string,
  }>,
  preOrder: boolean,
  preOrderDays: number,
};

type PropsType = {
  subtotal: number,
  product: ProductDTOType,
  currency: string,
};

class ProductBlock extends PureComponent<PropsType> {
  renderAttributes = (
    attributes: Array<{
      name: string,
      value: string,
    }>,
  ) => (
    <div styleName="attributes">
      <div styleName="names">
        {attributes.map((item, idx) => (
          // eslint-disable-next-line
          <Fragment key={`order-attribute-name-${idx}`}>
            <div>{item.name}</div>
          </Fragment>
        ))}
      </div>
      <div styleName="values">
        {attributes.map((item, idx) => (
          // eslint-disable-next-line
          <Fragment key={`order-attribute-value-${idx}`}>
            <div>{item.value}</div>
          </Fragment>
        ))}
      </div>
    </div>
  );

  render() {
    const { product, currency, subtotal } = this.props;
    const attributes = slice(0, 3, product.attributes);
    return (
      <div styleName="container">
        <div styleName="photoWrapper">
          {product.photoUrl ? (
            <img
              src={convertSrc(product.photoUrl, 'small')}
              alt=""
              styleName="photo"
            />
          ) : (
            <div styleName="emptyLogo">
              <Icon type="camera" size={40} />
            </div>
          )}
        </div>
        <div styleName="productInfoBlock">
          <div styleName="productName">
            <Link
              to={`/store/${product.storeId}/products/${
                product.id
              }/variant/${product.rawId || ''}`}
            >
              <strong styleName="productNameText">{product.name}</strong>
            </Link>
          </div>
          <div styleName="productCategory">
            <Link to={`/categories?category=${product.category.id}&search=`}>
              {product.category.name}
            </Link>
          </div>
          <div styleName="productPrice">
            {`${formatPrice(subtotal)} ${currency}`}
          </div>
        </div>
        {!isEmpty(attributes) && this.renderAttributes(attributes)}
      </div>
    );
  }
}

export default ProductBlock;
