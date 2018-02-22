// @flow

import React from 'react';

import { Container, Row, Col } from 'layout';
import { Page } from 'components/App';

import './StoreSettingsPage.scss';

const StoreSettingsPage = () => (
  <Container>
    <Row>
      <Col size={2}>
        <div styleName="left">main</div>
      </Col>
      <Col size={10}>
        <div styleName="right">main</div>
      </Col>
    </Row>
  </Container>
);

export default Page(StoreSettingsPage);
