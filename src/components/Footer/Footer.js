// @flow

import React from 'react';

import { Container, Row, Col } from 'containers';

import './Footer.scss';

const Footer = () => (
  <footer styleName="container">
    <Container>
      <Row>
        <Col size={12}>
          <div>footer</div>
        </Col>
      </Row>
    </Container>
  </footer>
);

export default Footer;
