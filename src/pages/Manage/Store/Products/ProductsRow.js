// @flow
import React from 'react';
import { isEmpty, map, pathOr } from 'ramda';
import ImageLoader from 'libs/react-image-loader';

import { Checkbox } from 'components/common/Checkbox';
import { Icon } from 'components/Icon';
import BannerLoading from 'components/Banner/BannerLoading';

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
      <div styleName="td tdFoto">
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
      </div>
      <div styleName="td tdName">
        <div>
          <span>{item.name}</span>
        </div>
      </div>
      <div styleName="td tdCategory">
        <div>
          <span>{item.categoryName}</span>
        </div>
      </div>
      <div styleName="td tdPrice">
        <div>
          {product &&
            product.price && <span>{`${formatPrice(product.price)} STQ`}</span>}
        </div>
      </div>
      <div styleName="td tdCashback">
        <div>
          {product &&
            product.cashback && (
              <span>{`${(product.cashback * 100).toFixed(0)}%`}</span>
            )}
        </div>
      </div>
      <div styleName="td tdCharacteristics">
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
      </div>
      <div styleName="td tdDelete">
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
    </div>
  );
};

export default ProductsRow;
