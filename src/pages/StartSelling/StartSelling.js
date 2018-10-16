// @flow

import React, { PureComponent } from 'react';
import { withRouter } from 'found';
import { pathOr } from 'ramda';

import { Footer } from 'components/App';
import { Container, Row, Col } from 'layout';

import {
  StartSellingHeader,
  StartSellingHeading,
  StartSellingMarket,
  StartSellingForSellers,
  StartSellingTryStoriqa,
  // StartSellingPrices,
  StartSellingFAQ,
} from './index';

import './StartSelling.scss';

class StartSelling extends PureComponent<{}> {
  render() {
    const lang = pathOr('en', ['match', 'params', 'lang'], this.props);
    return (
      <div styleName="container">
        <Container>
          <StartSellingHeader lang={lang} />
          <div styleName="wrapper">
            <Row>
              <Col size={1} />
              <Col size={12} sm={12} md={12} lg={10} xl={10}>
                <StartSellingHeading lang={lang} />
                <StartSellingMarket lang={lang} />
                <StartSellingTryStoriqa lang={lang} />
                <StartSellingForSellers lang={lang} />
                {/* <StartSellingPrices lang={lang} /> */}
                <StartSellingFAQ lang={lang} />
                <Footer />
              </Col>
              <Col size={1} />
            </Row>
          </div>
        </Container>
      </div>
    );
  }
}

export default withRouter(StartSelling);
