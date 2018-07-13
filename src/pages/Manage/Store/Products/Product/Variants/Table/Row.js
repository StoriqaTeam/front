// @flow

import React, { PureComponent } from 'react';
import { pathOr, map, addIndex, isEmpty, filter } from 'ramda';

import { Checkbox } from 'components/common/Checkbox';
import { Icon } from 'components/Icon';

import './Row.scss';

type PropsType = {
  variant: {
    id: string,
    rawId: number,
    vendorCode: string,
    price: number,
    cashback: number,
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
};

class Row extends PureComponent<PropsType> {
  handleCheckboxClick = () => {
    // this.setState(prevState => ({ checked: !prevState.checked }));
  };

  handleExpandClick = () => {
    this.props.onExpandClick(this.props.variant.rawId);
  };

  handleDelete = () => {
    this.props.handleDeleteVariant(this.props.variant.id);
  };

  render() {
    const {
      vendorCode,
      price,
      cashback: cashbackValue,
      attributes: attrs,
      stocks,
    } = this.props.variant;
    let filteredStocks = [];
    if (stocks) {
      filteredStocks = filter(item => item.quantity > 0, stocks);
    }
    const cashback =
      Math.round(cashbackValue * 100) != null
        ? Math.round(cashbackValue * 100)
        : null;
    return (
      <div styleName="container">
        <div styleName="variant">
          <div styleName="variantItem tdCheckbox">
            <Checkbox id="id-variant" onChange={this.handleCheckboxClick} />
          </div>
          <div styleName="variantItem tdArticle">
            <span styleName="text vendorCodeText">{vendorCode || ''}</span>
          </div>
          <div styleName="variantItem tdPrice">
            <span styleName="text priceText">{`${price} STQ`}</span>
          </div>
          <div styleName="variantItem tdCashback">
            <span styleName="text cashbackText">
              <strong>{cashback}</strong>%
            </span>
          </div>
          <div styleName="variantItem tdCharacteristics">
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
          <div styleName="variantItem tdCount">
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
          <div styleName="variantItem tdBasket">
            <button
              styleName="deleteButton"
              onClick={this.handleDelete}
              data-test="deleteVariantButton"
            >
              <Icon type="basket" size="32" />
            </button>
          </div>
          <div styleName="variantItem tdDropdawn">
            <button
              styleName="arrowExpand"
              onClick={this.handleExpandClick}
              data-test="toggleOpenVariantButton"
            >
              <Icon inline type="arrowExpand" />
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Row;
