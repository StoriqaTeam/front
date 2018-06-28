// @flow

import React, { PureComponent } from 'react';
import { find, propEq, pathOr } from 'ramda';

import { Icon } from 'components/Icon';
import { Row, Col } from 'layout';
import { convertSrc } from 'utils';

import StoresProducts from './StoresProducts';

import './Stores.scss';

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

class StoreRow extends PureComponent<PropsType> {
  render() {
    const { store } = this.props;
    const lang = 'EN';
    // $FlowIgnoreMe
    const name = pathOr(null, ['text'], find(propEq('lang', lang), store.name));
    // $FlowIgnoreMe
    const baseProduct = pathOr(null, ['baseProducts', 'edges'], store);
    const storeId = store.rawId;
    const { productsCount } = store;
    return (
      <div styleName="store" key={store.id}>
        <Row>
          <Col sm={12} md={4} lg={4} xl={4}>
            <div styleName="storeData">
              <div styleName="storeLogo" data-test="storeLink">
                {store.logo ? (
                  <img src={convertSrc(store.logo, 'small')} alt="img" />
                ) : (
                  <Icon type="camera" size="32" />
                )}
              </div>
              <div styleName="storeInfo">
                <div styleName="storeName">{name}</div>
                <div styleName="storeAdd">
                  <span>97,5% reviews</span>
                  {productsCount && (
                    <span styleName="productsCount">{productsCount} goods</span>
                  )}
                </div>
              </div>
            </div>
          </Col>
          <Col sm={1} md={3} lg={3} xl={3}>
            <div styleName="storeElect">
              <Icon type="heart" size="32" />
            </div>
          </Col>
          <Col sm={1} md={5} lg={5} xl={5}>
            {baseProduct && (
              <StoresProducts storeId={storeId} baseProduct={baseProduct} />
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

export default StoreRow;
