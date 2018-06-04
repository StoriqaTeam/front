// @flow

import React, { PureComponent, Fragment } from 'react';
import { slice } from 'ramda';

import { Banner } from 'components/Banner';
import { Container, Row, Col } from 'layout';

import './BannersRow.scss';

type PropsTypes = {
  items: Array<{
    id: any,
  }>,
  count?: number,
};

class BannersRow extends PureComponent<PropsTypes> {
  render() {
    const { count = 1, items } = this.props;
    const visibleBanners = slice(0, count, items);
    return (
      <Container>
        <Row>
          {visibleBanners &&
            visibleBanners.length &&
            visibleBanners.map(item => (
              <Fragment key={item.id}>
                <Col md={12 / count}>
                  <Banner item={item} />
                </Col>
              </Fragment>
            ))}
        </Row>
      </Container>
    );
  }
}

export default BannersRow;
