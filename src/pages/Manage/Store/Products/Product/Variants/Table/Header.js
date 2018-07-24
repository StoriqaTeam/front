// @flow

import React from 'react';

import { Checkbox } from 'components/common/Checkbox';
import { Icon } from 'components/Icon';

import './Header.scss';

type PropsType = {
  onSelectAllClick: () => void,
};

const Header = (props: PropsType) => (
  <div styleName="header">
    <div styleName="headerItem tdCheckbox">
      <Checkbox id="id-header" onChange={props.onSelectAllClick} />
    </div>
    <div styleName="headerItem tdArticle">
      <div styleName="headerItemWrap">
        <span>Vendor code</span>
        <Icon inline type="sortArrows" />
      </div>
    </div>
    <div styleName="headerItem tdPrice">
      <div styleName="headerItemWrap">
        <span>Price</span>
        <Icon inline type="sortArrows" />
      </div>
    </div>
    <div styleName="headerItem tdCashback">
      <div styleName="headerItemWrap">
        <span>Cashback</span>
        <Icon inline type="sortArrows" />
      </div>
    </div>
    <div styleName="headerItem tdCharacteristics">
      <div styleName="headerItemWrap">
        <span>Characteristics</span>
        <Icon inline type="sortArrows" />
      </div>
    </div>
    <div styleName="headerItem tdCount">
      <div styleName="headerItemWrap">
        <span>Count</span>
        <Icon inline type="sortArrows" />
      </div>
    </div>
    <div styleName="headerItem tdBasket">
      <button styleName="deleteButton">
        <Icon type="basket" size="32" />
      </button>
    </div>
    <div styleName="headerItem tdDropdawn" />
  </div>
);

export default Header;
