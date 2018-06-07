// @flow

import React, { Component } from 'react';
import { pathOr, map } from 'ramda';

import { Checkbox } from 'components/common/Checkbox';
import { Icon } from 'components/Icon';

import './Row.scss';

type PropsType = {
  variant: {
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
  },
  onExpandClick: Function,
};

type StateType = {
  // checked: boolean,
};

class Row extends Component<PropsType, StateType> {
  state: StateType = {
    // checked: false,
  };

  handleCheckboxClick = () => {
    // this.setState(prevState => ({ checked: !prevState.checked }));
  };

  handleExpandClick = () => {
    this.props.onExpandClick(this.props.variant.rawId);
  };

  render() {
    const {
      vendorCode,
      price,
      cashback: cashbackValue,
      attributes: attrs,
    } = this.props.variant;
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
                  const name = pathOr(
                    '',
                    ['attribute', 'name', 0, 'text'],
                    // $FlowIgnoreMe
                    item,
                  );
                  return <div key={`attr-${name}`}>{`${name}: `}</div>;
                }, attrs)}
              </div>
              <div styleName="characteristicValues">
                {map(item => {
                  const name = pathOr(
                    '',
                    ['attribute', 'name', 0, 'text'],
                    // $FlowIgnoreMe
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
                <div>1 storage</div>
                <div>2 storage</div>
              </div>
              <div styleName="storagesValues">
                <div>
                  <strong>56</strong>
                </div>
                <div>
                  <strong>67</strong>
                </div>
              </div>
            </div>
          </div>
          <div styleName="variantItem tdBasket">
            <button styleName="deleteButton">
              <Icon type="basket" size="32" />
            </button>
          </div>
          <div styleName="variantItem tdDropdawn">
            <button styleName="arrowExpand" onClick={this.handleExpandClick}>
              <Icon inline type="arrowExpand" />
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Row;
