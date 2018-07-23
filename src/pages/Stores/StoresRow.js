// @flow

import React, { PureComponent } from 'react';
import { pathOr } from 'ramda';

import { Icon } from 'components/Icon';
import { Row, Col } from 'layout';

import StoresProducts from './StoresProducts';
import StoresData from './StoresData';

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
    const baseProduct = pathOr(null, ['baseProducts', 'edges'], store);
    const storeId = store.rawId;
    return (
      <div styleName="container" key={store.id}>
        <Row>
          <Col size={12} sm={4} md={4} lg={4} xl={4}>
            <StoresData store={store} />
          </Col>
          <Col sm={1} md={3} lg={3} xl={3} mdVisible>
            <div styleName="storeElect">
              <Icon type="heart" size="32" />
            </div>
          </Col>
          <Col sm={7} md={5} lg={5} xl={5}>
            {baseProduct && (
              <StoresProducts storeId={storeId} baseProduct={baseProduct} />
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

export default StoresRow;
