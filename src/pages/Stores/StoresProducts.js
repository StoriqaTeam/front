import React from 'react';
import { head, map, pathOr } from 'ramda';
import { Link } from 'found';

import { Icon } from 'components/Icon';
import { convertSrc } from 'utils';

import './StoresProducts.scss';

type PropsType = {
  storeId: number,
  findMostViewedProducts: any,
};

const StoresProducts = ({ storeId, findMostViewedProducts }: PropsType) => (
  <div styleName="container">
    <div styleName="productsWrap">
      {map(baseProductNode => {
        const baseProductId = baseProductNode.rawId;
        const products = pathOr([], ['products', 'edges'], baseProductNode);
        const product = head(products);
        const photoMain = pathOr(null, ['node', 'photoMain'], product);
        return (
          <Link
            key={baseProductId}
            to={`/store/${storeId}/products/${baseProductId}`}
            styleName="productPhoto"
            data-test="productLink"
          >
            <div styleName="productPhotoWrap">
              {photoMain ? (
                <img src={convertSrc(photoMain, 'small')} alt="img" />
              ) : (
                <Icon type="camera" size="32" />
              )}
            </div>
          </Link>
        );
      }, map(baseProductItem => baseProductItem.node, findMostViewedProducts))}
    </div>
  </div>
);

export default StoresProducts;
