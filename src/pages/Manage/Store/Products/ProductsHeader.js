// @flow
import React from 'react';

import { Checkbox } from 'components/common/Checkbox';
import { Icon } from 'components/Icon';
import { Col } from 'layout';

import './ProductsHeader.scss';

const ProductsHeader = () => (
  <div styleName="headerRowWrap">
    <div styleName="tdCheckbox">
      <Checkbox id="header" onChange={() => {}} />
    </div>
    <Col size={1} sm={2} md={2} lg={2} xl={1} mdVisible />
    <Col size={4} sm={4} md={4} lg={3} xl={2}>
      <div styleName="colColor name">
        <span>Name</span>
        <Icon inline type="sortArrows" />
      </div>
    </Col>
    <Col size={2} sm={2} md={2} lg={2} xl={2} xlVisible>
      <div styleName="colColor">
        <span>Category</span>
        <Icon inline type="sortArrows" />
      </div>
    </Col>
    <Col size={3} sm={3} md={3} lg={3} xl={2} mdVisible>
      <div styleName="colColor">
        <span>Price</span>
        <Icon inline type="sortArrows" />
      </div>
    </Col>
    <Col size={3} sm={3} md={3} lg={3} xl={2} lgVisible>
      <div styleName="colColor">
        <span>Cashback</span>
        <Icon inline type="sortArrows" />
      </div>
    </Col>
    <Col size={2} sm={2} md={2} lg={2} xl={2} xlVisible>
      <div styleName="colColor">
        <span>Characteristics</span>
        <Icon inline type="sortArrows" />
      </div>
    </Col>
    <Col size={3} sm={3} md={3} lg={1} xl={1}>
      <div styleName="tdDelete">
        <button styleName="deleteButton">
          <Icon type="basket" size="32" />
        </button>
      </div>
    </Col>
  </div>
);

export default ProductsHeader;
