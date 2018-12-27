// @flow strict

import React from 'react';

import { Icon } from 'components/Icon';
import { Col } from 'layout';

import './StoragesHeader.scss';

import t from './i18n';

const StoragesHeader = () => (
  <div styleName="container">
    <Col size={12} sm={6} md={5} lg={3} xl={3} mdVisible>
      <div styleName="headerCheckbox">
        <div>
          <span>{t.storage}</span>
          <Icon inline type="sortArrows" />
        </div>
      </div>
    </Col>
    <Col size={12} sm={6} md={4} lg={8} xl={8} mdVisible>
      <div>
        <span>{t.address}</span>
        <Icon inline type="sortArrows" />
      </div>
    </Col>
    {/* <Col size={12} sm={6} md={3} lg={1} xl={1} mdVisible>
      <div styleName="deleteButtonWrapper">
        <button styleName="deleteButton">
          <Icon type="basket" size="32" />
        </button>
      </div>
    </Col> */}
  </div>
);

export default StoragesHeader;
