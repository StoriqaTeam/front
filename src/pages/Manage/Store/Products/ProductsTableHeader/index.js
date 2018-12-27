// @flow strict
import React from 'react';

import { Icon } from 'components/Icon';
import { Col } from 'layout';

import './ProductsTableHeader.scss';

import t from './i18n';

const ProductsTableHeader = () => (
  <div styleName="headerRowWrap">
    <Col size={1} sm={2} md={2} lg={2} xl={1} mdVisible />
    <Col size={4} sm={4} md={4} lg={3} xl={2}>
      <div styleName="colColor name">
        <span>{t.name}</span>
        <Icon inline type="sortArrows" />
      </div>
    </Col>
    <Col size={2} sm={2} md={2} lg={2} xl={2} xlVisible>
      <div styleName="colColor">
        <span>{t.category}</span>
        <Icon inline type="sortArrows" />
      </div>
    </Col>
    <Col size={3} sm={3} md={3} lg={3} xl={2} mdVisible>
      <div styleName="colColor">
        <span>{t.price}</span>
        <Icon inline type="sortArrows" />
      </div>
    </Col>
    <Col size={3} sm={3} md={3} lg={3} xl={2} lgVisible>
      <div styleName="colColor">
        <span>{t.cashback}</span>
        <Icon inline type="sortArrows" />
      </div>
    </Col>
    <Col size={2} sm={2} md={2} lg={2} xl={2} xlVisible>
      <div styleName="colColor">
        <span>{t.characteristics}</span>
        <Icon inline type="sortArrows" />
      </div>
    </Col>
  </div>
);

export default ProductsTableHeader;
