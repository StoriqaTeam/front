// @flow

import React, { Fragment } from 'react';
import { Link } from 'found';

import { Rating } from 'components/common/Rating';

import { extractText, convertSrc } from 'utils';

import { ProductContext } from '../index';
import ChatIcon from './svg/chat.svg';
import HeartIcon from './svg/heart.svg';

import type { ProductType } from '../types';

import './ProductStore.scss';

import t from './i18n';

const ProductStore = () => (
  <ProductContext.Consumer>
    {({ store }: ProductType) => (
      <Fragment>
        {store ? (
          <div styleName="container">
            <div styleName="storeInfoWrapper">
              <Link to={`/store/${store.rawId}`} styleName="storeInfo">
                <div
                  role="img"
                  styleName="image"
                  style={{
                    backgroundImage: convertSrc(store.logo, 'small')
                      ? `url(${convertSrc(store.logo, 'small')})`
                      : 'none',
                  }}
                />
                <div>
                  <h4 styleName="storeName">{extractText(store.name)}</h4>
                  <Rating value={store.rating} />
                </div>
              </Link>
              <div styleName="storeDetails">
                <p>{store.productsCount} {t.goods}</p>
                <p>0 {t.userReviews}</p>
              </div>
            </div>
            <div styleName="iconsWrapper">
              <div styleName="iconInfo">
                <span styleName="icon">
                  <ChatIcon />
                </span>
                <small styleName="iconInfoText">{t.contactSeller}</small>
              </div>
              <span styleName="separator" />
              <div styleName="iconInfo">
                <span styleName="icon">
                  <HeartIcon />
                </span>
                <small styleName="iconInfoText">{t.toFavorites}</small>
              </div>
            </div>
          </div>
        ) : (
          <div className="noStore">{t.noStore}</div>
        )}
      </Fragment>
    )}
  </ProductContext.Consumer>
);

export default ProductStore;
