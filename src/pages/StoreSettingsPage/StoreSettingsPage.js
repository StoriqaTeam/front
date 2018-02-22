import React, { PureComponent } from 'react';

import { Container, Row, Col } from 'containers';
import { Page } from 'components/Page';

import './StoreSettingsPage.scss';

class StoreSettingsPage extends PureComponent { // eslint-disable-line
  render() {
    return (
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
  }
}

export default Page(StoreSettingsPage);
