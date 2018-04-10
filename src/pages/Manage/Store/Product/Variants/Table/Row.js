// @flow

import React, { Component } from 'react';

import { Checkbox } from 'components/Checkbox';
import { Icon } from 'components/Icon';

import './Row.scss';

type PropsType = {
  variant: {
    rawId: number,
    product: {
      vendorCode: string,
      price: number,
      cashback: number,
    },
  },
  onExpandClick: Function;
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
      product: {
        vendorCode,
        price,
        cashback,
      },
    } = this.props.variant;
    return (
      <div styleName="container">
        <div styleName="variant">
          <div styleName="variantItem tdCheckbox">
            <Checkbox
              id="id-variant"
              onChange={this.handleCheckboxClick}
            />
          </div>
          <div styleName="variantItem tdDropdawn">
            <button onClick={this.handleExpandClick}>
              <Icon inline type="closeArrow" />
            </button>
          </div>
          <div styleName="variantItem tdArticle">
            <span styleName="text vendorCodeText">{vendorCode || ''}</span>
          </div>
          <div styleName="variantItem tdPrice">
            <span styleName="text priceText">{`${price} STQ`}</span>
          </div>
          <div styleName="variantItem tdCashback">
            <span styleName="text cashbackText">{`${cashback}%`}</span>
          </div>
          <div styleName="variantItem tdCharacteristics">Characteristics</div>
          <div styleName="variantItem tdCount">8</div>
          <div styleName="variantItem tdBasket">
            <button>
              <Icon type="basket" />
            </button>
          </div>
        </div>
        <div styleName="line" />
      </div>
    );
  }
}

export default Row;
