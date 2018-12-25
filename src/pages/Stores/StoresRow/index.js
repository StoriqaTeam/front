// @flow strict

import React, { PureComponent } from 'react';
import { pathOr } from 'ramda';

import { Row, Col } from 'layout';

import StoresProducts from '../StoresProducts';
import StoresData from '../StoresData';

import './StoresRow.scss';

type PropsType = {
  store: {
    name: Array<{
      lang: string,
      text: string,
    }>,
    rawId: number,
    id: string,
    productsCount: number,
    logo: ?string,
  },
};

class StoresRow extends PureComponent<PropsType> {
  render() {
    const { store } = this.props;
    // $FlowIgnoreMe
    const findMostViewedProducts = pathOr(
      null,
      ['findMostViewedProducts', 'edges'],
      store,
    );
    const storeId = store.rawId;
    return (
      <div styleName="container" key={store.id}>
        <Row>
          <Col size={12} sm={12} md={6}>
            <StoresData store={store} />
          </Col>
          <Col size={12} sm={12} md={6} mdVisible>
            {findMostViewedProducts && (
              <StoresProducts
                storeId={storeId}
                findMostViewedProducts={findMostViewedProducts}
              />
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

export default StoresRow;
