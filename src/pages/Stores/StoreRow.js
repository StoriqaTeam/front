// @flow

import React, { PureComponent } from 'react';
import { map, find, propEq, pathOr, head } from 'ramda';

import { Icon } from 'components/Icon';
import { Row, Col } from 'layout';
import { Link } from 'found';

import './Stores.scss';

type PropsType = {
  store: { name: {}, rawId: any, id: any, productsCount: number, logo: ?string, },
};

class StoreRow extends PureComponent<PropsType> {
  render() {
    const { store } = this.props;
    const lang = 'EN';
    const name = find(propEq('lang', lang), store.name).text;
    const products = pathOr(null, ['baseProductsWithVariants', 'edges'], store);
    const storeId = store.rawId;
    const { productsCount } = store;
    return (
      <div styleName="store" key={store.id}>
        <Row>
          <Col size={6}>
            <div styleName="storeData">
              <Link
                to={`/store/${store.rawId}`}
                styleName="storeLogo"
              >
                {store.logo ?
                  <img src={store.logo} alt="img" /> :
                  <Icon type="camera" size="32" />
                }
              </Link>
              <div styleName="storeInfo">
                <div styleName="storeName">{name}</div>
                <div styleName="storeAdd">
                  <span>97,5% reviews</span>
                  {productsCount && <span styleName="productsCount">{productsCount} goods</span>}
                </div>
              </div>
              <div styleName="storeElect">
                <Icon type="heart" size="32" />
              </div>
            </div>
          </Col>
          <Col size={6}>
            {products &&
              <div styleName="productsData">
                <div styleName="productsWrap">
                  {map(productsItem => productsItem.node, products).map((product) => {
                    const photoMain = pathOr(null, ['product', 'photoMain'], head(product.variants));
                    const productId = product.rawId;
                    return (
                      <Link
                        key={productId}
                        to={`/store/${storeId}/products/${productId}`}
                        styleName="productFoto"
                      >
                        <div styleName="productFotoWrap">
                          {photoMain ?
                            <img src={photoMain} alt="img" /> :
                            <Icon type="camera" size="32" />
                          }
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            }
          </Col>
        </Row>
      </div>
    );
  }
}

export default StoreRow;
