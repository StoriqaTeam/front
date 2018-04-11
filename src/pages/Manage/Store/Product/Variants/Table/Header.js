// @flow

import React from 'react';

import { Checkbox } from 'components/Checkbox';
import { Icon } from 'components/Icon';

import './Header.scss';

type PropsType = {
  onSelectAllClick: () => void,
};

const Header = (props: PropsType) => (
  <div styleName="header">
    <div styleName="headerItem tdCheckbox">
      <Checkbox
        id="id-header"
        onChange={props.onSelectAllClick}
      />
    </div>
    <div styleName="headerItem tdDropdawn" />
    <div styleName="headerItem tdArticle">
      <div styleName="headerItemWrap">
        <span>Article</span>
        <Icon inline type="arrowExpand" />
      </div>
    </div>
    <div styleName="headerItem tdPrice">
      <div styleName="headerItemWrap">
        <span>Price</span>
        <Icon inline type="arrowExpand" />
      </div>
    </div>
    <div styleName="headerItem tdCashback">
      <div styleName="headerItemWrap">
        <span>Cashback</span>
        <Icon inline type="arrowExpand" />
      </div>
    </div>
    <div styleName="headerItem tdCharacteristics">
      <div styleName="headerItemWrap">
        <span>Characteristics</span>
        <Icon inline type="arrowExpand" />
      </div>
    </div>
    <div styleName="headerItem tdCount">
      <div styleName="headerItemWrap">
        <span>Count</span>
        <Icon inline type="arrowExpand" />
      </div>
    </div>
    <div styleName="headerItem tdBasket">
      <button>
        <Icon type="basket" />
      </button>
    </div>
  </div>
);

export default Header;
