// @flow
import React from 'react';

import { Checkbox } from 'components/common/Checkbox';
import { Icon } from 'components/Icon';

import './ProductsHeader.scss';

const ProductsHeader = () => (
  <div styleName="headerRowWrap">
    <div styleName="td tdCheckbox">
      <Checkbox id="header" onChange={() => {}} />
    </div>
    <div styleName="td tdFoto" />
    <div styleName="td tdName">
      <div>
        <span>Name</span>
        <Icon inline type="sortArrows" />
      </div>
    </div>
    <div styleName="td tdCategory">
      <div>
        <span>Category</span>
        <Icon inline type="sortArrows" />
      </div>
    </div>
    <div styleName="td tdPrice">
      <div>
        <span>Price</span>
        <Icon inline type="sortArrows" />
      </div>
    </div>
    <div styleName="td tdCashback">
      <div>
        <span>Cashback</span>
        <Icon inline type="sortArrows" />
      </div>
    </div>
    <div styleName="td tdCharacteristics">
      <span>Characteristics</span>
      <Icon inline type="sortArrows" />
    </div>
    <div styleName="td tdDelete">
      <button styleName="deleteButton">
        <Icon type="basket" size="32" />
      </button>
    </div>
  </div>
);

export default ProductsHeader;
