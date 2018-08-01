// @flow
import React from 'react';
import { isEmpty, map, pathOr } from 'ramda';
import ImageLoader from 'libs/react-image-loader';

import { Checkbox } from 'components/common/Checkbox';
import { Icon } from 'components/Icon';
import BannerLoading from 'components/Banner/BannerLoading';
import { Col } from 'layout';

import { convertSrc, formatPrice, getNameText } from 'utils';

import './ProductsRow.scss';

type PropsType = {
  item: {
    id: string,
    rawId: number,
    categoryName: string,
    currencyId: number,
    name: string,
    product: {
      cashback: ?number,
      photoMain: ?string,
      price: ?number,
    },
  },
  onEdit: any => any,
  onCheckbox: any => any,
  onDelete: (any, any) => any,
};

const ProductsRow = ({ item, onEdit, onDelete, onCheckbox }: PropsType) => {
  const { product } = item;
  // $FlowIgnoreMe
  const attributes = pathOr([], ['product', 'attributes'], item);
  return (
    <div
      key={item.rawId}
      styleName="itemRowWrap"
      onClick={() => {
        onEdit(item.rawId);
      }}
      onKeyDown={() => {}}
      role="button"
      tabIndex="0"
      data-test="editProductButton"
    >
      <div styleName="td tdCheckbox">
        <Checkbox id={item.rawId} onChange={onCheckbox} />
      </div>
      <Col size={4} sm={4} md={2} lg={2} xl={1}>
        <div styleName="foto">
          {!product || !product.photoMain ? (
            <Icon type="camera" size="40" />
          ) : (
            <ImageLoader
              fit
              src={convertSrc(product.photoMain, 'small')}
              loader={<BannerLoading />}
            />
          )}
        </div>
      </Col>
      <Col size={4} sm={4} md={4} lg={3} xl={2}>
        <div styleName="name">
          <span>{item.name}</span>
        </div>
      </Col>
      <Col size={2} sm={2} md={2} lg={2} xl={2} xlVisible>
        <div>
          <span>{item.categoryName}</span>
        </div>
      </Col>
      <Col size={3} sm={3} md={3} lg={3} xl={2} mdVisible>
        <div>
          {product &&
            product.price && <span>{`${formatPrice(product.price)} STQ`}</span>}
        </div>
      </Col>
      <Col size={3} sm={3} md={3} lg={3} xl={2} lgVisible>
        <div>
          {product &&
            product.cashback && (
              <span>{`${(product.cashback * 100).toFixed(0)}%`}</span>
            )}
        </div>
      </Col>
      <Col size={2} sm={2} md={2} lg={2} xl={2} xlVisible>
        {!isEmpty(attributes) && (
          <div>
            <div styleName="characteristicItem">
              <div styleName="characteristicLabels">
                {map(attributeItem => {
                  const attributeName = getNameText(
                    attributeItem.attribute.name,
                    'EN',
                  );
                  return (
                    <div key={`attr-${attributeName}`}>
                      {`${attributeName}: `}
                    </div>
                  );
                }, attributes)}
              </div>
              <div styleName="characteristicValues">
                {map(attributeItem => {
                  const attributeName = getNameText(
                    attributeItem.attribute.name,
                    'EN',
                  );
                  const val = attributeItem.value;
                  return <div key={`attr-${attributeName}`}>{`${val}`}</div>;
                }, attributes)}
              </div>
            </div>
          </div>
        )}
      </Col>
      <Col size={4} sm={4} md={3} lg={1} xl={1}>
        <div styleName="buttons">
          <button
            styleName="editButton"
          >
            <Icon type="note" size={32} />
          </button>
          <button
            styleName="deleteButton"
            onClick={(e: any) => {
              onDelete(item.id, e);
            }}
            data-test="deleteProductButton"
          >
            <Icon type="basket" size="32" />
          </button>
        </div>
      </Col>
    </div>
  );
};

export default ProductsRow;
