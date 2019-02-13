// @flow strict

import React, { PureComponent } from 'react';
import { pathOr, map, addIndex, isEmpty, filter } from 'ramda';

// import { Checkbox } from 'components/common/Checkbox';
import { Icon } from 'components/Icon';

import { log, formatPrice } from 'utils';

import type { ProductType } from 'pages/Manage/Store/Products/types';
import type { SelectItemType } from 'types';

import './Row.scss';

type PropsType = {
  variant: ProductType,
  currency: SelectItemType,
  handleDeleteVariant: (id: string) => void,
  onExpandClick: (id: number) => void,
  onCopyVariant: (variant: ProductType) => void,
};

class Row extends PureComponent<PropsType> {
  handleCheckboxClick = (id: string | number) => {
    log.info('id', id);
  };

  handleExpandClick = () => {
    // $FlowIgnoreMe
    const rawId = pathOr(null, ['variant', 'rawId'], this.props);
    if (rawId) {
      this.props.onExpandClick(rawId);
    }
  };

  handleDelete = (e: SyntheticEvent<HTMLDivElement>) => {
    e.stopPropagation();
    // $FlowIgnoreMe
    const id = pathOr(null, ['variant', 'id'], this.props);
    if (id) {
      this.props.handleDeleteVariant(id);
    }
  };

  handleCopy = (variant: ProductType, e: SyntheticEvent<HTMLDivElement>) => {
    e.stopPropagation();
    this.props.onCopyVariant(variant);
  };

  render() {
    const { currency, variant } = this.props;
    const {
      // rawId,
      vendorCode,
      price,
      cashback,
      discount,
      attributes: attrs,
      stocks,
    } = variant;
    let filteredStocks = [];
    if (stocks) {
      filteredStocks = filter(item => item.quantity > 0, stocks);
    }
    return (
      <div
        styleName="container"
        onClick={this.handleExpandClick}
        onKeyDown={() => {}}
        role="button"
        tabIndex="0"
        data-test="toggleOpenVariantButton"
      >
        <div styleName="variant">
          {/* <div styleName="td tdCheckbox">
            <Checkbox id={rawId} onChange={this.handleCheckboxClick} />
          </div> */}
          <div styleName="td tdArticle">
            <span styleName="text vendorCodeText">{vendorCode || ''}</span>
          </div>
          <div styleName="td tdPrice">
            <span styleName="text priceText">{`${formatPrice(price)} ${
              currency.label
            }`}</span>
          </div>
          <div styleName="td tdCashback">
            <span styleName="text cashbackText">
              <strong>{!cashback ? 0 : Math.round(cashback * 100)}</strong>%
            </span>
          </div>
          <div styleName="td tdDiscount">
            <span styleName="text discountText">
              <strong>{!discount ? 0 : Math.round(discount * 100)}</strong>%
            </span>
          </div>
          <div styleName="td tdCharacteristics">
            <div styleName="characteristicItem">
              <div styleName="characteristicLabels">
                {map(item => {
                  // $FlowIgnoreMe
                  const name = pathOr(
                    '',
                    ['attribute', 'name', 0, 'text'],
                    item,
                  );
                  return <div key={`attr-${name}`}>{`${name}: `}</div>;
                }, attrs)}
              </div>
              <div styleName="characteristicValues">
                {map(item => {
                  // $FlowIgnoreMe
                  const name = pathOr(
                    '',
                    ['attribute', 'name', 0, 'text'],
                    item,
                  );
                  const val = item.value;
                  return <div key={`attr-${name}`}>{`${val}`}</div>;
                }, attrs)}
              </div>
            </div>
          </div>
          <div styleName="td tdCount">
            <div styleName="storagesItem">
              <div styleName="storagesLabels">
                {addIndex(map)((item, idx) => {
                  // $FlowIgnoreMe
                  const warehouseName = pathOr('', ['warehouse', 'name'], item);
                  // $FlowIgnoreMe
                  const warehouseSlug = pathOr('', ['warehouse', 'slug'], item);
                  return idx >= 2 ? (
                    false
                  ) : (
                    <div key={item.id} styleName="warehouseName">
                      {// $FlowIgnoreMe
                      warehouseName || `Storage ${warehouseSlug}`}
                    </div>
                  );
                }, filteredStocks)}
                {!isEmpty(filteredStocks) &&
                  filteredStocks.length > 2 && (
                    <div styleName="more">
                      {`+${filteredStocks.length - 2} ${
                        filteredStocks.length > 3 ? 'storages' : 'storage'
                      }`}
                    </div>
                  )}
                {isEmpty(filteredStocks) && <div>No storages</div>}
              </div>
              <div styleName="storagesValues">
                {addIndex(map)(
                  (item, idx) =>
                    idx >= 2 ? (
                      false
                    ) : (
                      <div key={item.id}>
                        <strong>{item.quantity}</strong>
                      </div>
                    ),
                  filteredStocks,
                )}
              </div>
            </div>
          </div>
          <div styleName="td tdBasket">
            <button
              styleName="deleteButton"
              onClick={(e: SyntheticEvent<HTMLDivElement>) =>
                this.handleCopy(this.props.variant, e)
              }
              data-test="deleteVariantButton"
            >
              <Icon type="copy" size={32} />
            </button>
          </div>
          <div styleName="td tdCopy">
            <button
              styleName="deleteButton"
              onClick={this.handleDelete}
              data-test="deleteVariantButton"
            >
              <Icon type="basket" size={32} />
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Row;
