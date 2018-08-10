// @flow

import React, { PureComponent } from 'react';
import { pathOr, map, addIndex, isEmpty, filter } from 'ramda';
import classNames from 'classnames';

import { Checkbox } from 'components/common/Checkbox';
import { Icon } from 'components/Icon';

import { log } from 'utils';

import './Row.scss';

type PropsType = {
  variant: {
    id: string,
    rawId: number,
    vendorCode: string,
    price: number,
    cashback: number,
    discount: number,
    attributes: Array<{
      attribute: {
        name: Array<{ text: string }>,
      },
      value: string,
    }>,
    stocks: Array<{
      id: string,
      productId: number,
      warehouseId: string,
      quantity: number,
      warehouse: {
        name: string,
        addressFull: {
          value: string,
        },
      },
    }>,
  },
  onExpandClick: (id: number) => void,
  handleDeleteVariant: (id: string) => void,
  isOpen: boolean,
  notRemove: boolean,
};

class Row extends PureComponent<PropsType> {
  handleCheckboxClick = (id: string | number) => {
    log.info('id', id);
  };

  handleExpandClick = () => {
    this.props.onExpandClick(this.props.variant.rawId);
  };

  handleDelete = (e: any) => {
    e.stopPropagation();
    this.props.handleDeleteVariant(this.props.variant.id);
  };

  render() {
    const { isOpen, notRemove } = this.props;
    const {
      rawId,
      vendorCode,
      price,
      cashback,
      discount,
      attributes: attrs,
      stocks,
    } = this.props.variant;
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
          <div styleName="td tdCheckbox">
            <Checkbox id={rawId} onChange={this.handleCheckboxClick} />
          </div>
          <div styleName="td tdArticle">
            <span styleName="text vendorCodeText">{vendorCode || ''}</span>
          </div>
          <div styleName="td tdPrice">
            <span styleName="text priceText">{`${price} STQ`}</span>
          </div>
          <div styleName="td tdCashback">
            <span styleName="text cashbackText">
              <strong>
                {Math.round(cashback * 100) != null
                  ? Math.round(cashback * 100)
                  : null}
              </strong>%
            </span>
          </div>
          <div styleName="td tdDiscount">
            <span styleName="text discountText">
              <strong>
                {Math.round(discount * 100) != null
                  ? Math.round(discount * 100)
                  : null}
              </strong>%
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
                  return idx >= 2 ? (
                    false
                  ) : (
                    <div key={item.id} styleName="warehouseName">
                      {warehouseName}
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
            {!notRemove && (
              <button
                styleName="deleteButton"
                onClick={this.handleDelete}
                data-test="deleteVariantButton"
              >
                <Icon type="basket" size="32" />
              </button>
            )}
          </div>
          <div styleName={classNames('td tdDropdawn', { isOpen })}>
            <div styleName="arrowExpand">
              <Icon inline type="arrowExpand" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Row;
