// @flow

import React from 'react';
import { Col } from 'layout';
import { Icon } from 'components/Icon';

import './TableTitle.scss';

import t from './i18n';

const TableTitle = () => (
  <div styleName="container">
    <Col size={2} sm={4} md={3} lg={2} xl={1}>
      <span styleName="number">
        <span styleName="title">
          {t.number}
          <Icon type="sortArrows" />
        </span>
      </span>
      <span styleName="poundSign">
        <span styleName="title">
          #
          <Icon type="sortArrows" />
        </span>
      </span>
    </Col>
    <Col size={5} sm={4} md={3} lg={3} xl={1}>
      <span styleName="title">
        {t.date}
        <Icon type="sortArrows" />
      </span>
    </Col>
    <Col lg={2} xl={2} xlVisible>
      <span styleName="title">
        {t.shop}
        <Icon type="sortArrows" />
      </span>
    </Col>
    <Col lg={2} xl={1} xlVisible>
      <span styleName="title">
        {t.delivery}
        <Icon type="sortArrows" />
      </span>
    </Col>
    <Col size={5} sm={4} md={3} lg={2} xl={2}>
      <span styleName="title">
        {t.items}
        <Icon type="sortArrows" />
      </span>
    </Col>
    <Col md={2} lg={2} xl={1} mdVisible>
      <span styleName="title">
        {t.price}
        <Icon type="sortArrows" />
      </span>
    </Col>
    <Col md={2} lg={3} xl={2} lgVisible>
      <span styleName="title">
        {t.status}
        <Icon type="sortArrows" />
      </span>
    </Col>
    <div styleName="border" />
  </div>
);

export default TableTitle;
