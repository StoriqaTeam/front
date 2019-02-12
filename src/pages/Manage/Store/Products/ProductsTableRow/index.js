// @flow strict
import React from 'react';
import { isEmpty, map, pathOr, isNil } from 'ramda';
// $FlowIgnoreMe
import ImageLoader from 'libs/react-image-loader';

import { Icon } from 'components/Icon';
import BannerLoading from 'components/Banner/BannerLoading';
import { Col } from 'layout';

import { convertSrc, formatPrice, getNameText } from 'utils';

import './ProductsTableRow.scss';

import t from './i18n';

type PropsType = {
  item: {
    id: string,
    rawId: number,
    categoryName: string,
    currency: string,
    name: string,
    product: {
      cashback: ?number,
      photoMain: ?string,
      price: ?number,
    },
  },
  index: string,
  onEdit: number => void,
  onDelete: (string, SyntheticEvent<HTMLButtonElement>) => void,
};

const ProductsTableRow = ({ item, onEdit, onDelete, index }: PropsType) => {
  const { product } = item;
  // $FlowIgnoreMe
  const attributes = pathOr([], ['product', 'attributes'], item);
  return (
    <div
      styleName="itemRowWrap"
      onClick={() => {
        onEdit(item.rawId);
      }}
      onKeyDown={() => {}}
      role="button"
      tabIndex="0"
      data-test={`productRow_${index}`}
    >
      <Col size={4} sm={4} md={2} lg={2} xl={1}>
        <div styleName="foto">
          {!product || isNil(product.photoMain) || product.photoMain === '' ? (
            <Icon type="camera" size={40} />
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
        {product &&
          !isNil(product.price) && (
            <span>{`${formatPrice(product.price)} ${item.currency}`}</span>
          )}
      </Col>
      <Col size={3} sm={3} md={3} lg={3} xl={2} lgVisible>
        {product && !isNil(product.cashback) ? (
          <span>{`${(product.cashback * 100).toFixed(0)}%`}</span>
        ) : (
          '0%'
        )}
      </Col>
      <Col size={2} sm={2} md={2} lg={2} xl={2} xlVisible>
        {!isEmpty(attributes) ? (
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
        ) : (
          t.noCharacteristic
        )}
      </Col>
      <Col size={4} sm={4} md={3} lg={1} xl={1}>
        <div styleName="buttons">
          <button
            styleName="editButton"
            data-test={`editProductButton_${index}`}
          >
            <Icon type="note" size={32} />
          </button>
          <button
            styleName="deleteButton"
            onClick={(e: SyntheticEvent<HTMLButtonElement>) => {
              onDelete(item.id, e);
            }}
            data-test={`deleteProductButton_${index}`}
          >
            <Icon type="basket" size={32} />
          </button>
        </div>
      </Col>
    </div>
  );
};

export default ProductsTableRow;
