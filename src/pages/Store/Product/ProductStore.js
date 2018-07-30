// @flow

import React from 'react';
import { Link } from 'found';

import { Rating } from 'components/common/Rating';

import { extractText } from 'utils';

import type { ProductType } from './types';
import ChatIcon from './svg/chat.svg';
import HeartIcon from './svg/heart.svg';
import { ProductContext } from './index';

import './ProductStore.scss';

const ProductStore = () => (
  <ProductContext.Consumer>
    {({ store }: ProductType) => (
      <div styleName="container">
        <div styleName="storeInfoWrapper">
          <Link to={`/store/${store.rawId}`} styleName="storeInfo">
            <div
              role="img"
              styleName="image"
              style={{
                backgroundImage: store.logo ? `url(${store.logo})` : 'none',
              }}
            />
            <div>
              <h4 styleName="storeName">{extractText(store.name)}</h4>
              <Rating value={store.rating} />
            </div>
          </Link>
          <div styleName="storeDetails">
            <p>{store.productsCount} goods</p>
            <p>97,5% user reviews</p>
          </div>
        </div>
        <div styleName="iconsWrapper">
          <div styleName="iconInfo">
            <span styleName="icon">
              <ChatIcon />
            </span>
            <small styleName="iconInfoText">Contact seller</small>
          </div>
          <span styleName="separator" />
          <div styleName="iconInfo">
            <span styleName="icon">
              <HeartIcon />
            </span>
            <small styleName="iconInfoText">To Favorites</small>
          </div>
        </div>
      </div>
    )}
  </ProductContext.Consumer>
);

export default ProductStore;
