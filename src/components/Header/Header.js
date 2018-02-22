// @flow

import React from 'react';

import { Container, Row, Col } from 'containers';

import './Header.scss';

const Header = () => (
  <header styleName="container">
    <Container>
      <Row>
        <Col size={12}>
          <div>header</div>
        </Col>
      </Row>
    </Container>
  </header>
);

export default Header;
