// @flow

import React, { Component } from 'react';

import Rating from 'components/Rating';

import { extractText } from 'utils';

import { ProductStoreType } from './types';
import ChatIcon from './svg/chat.svg';
import HeartIcon from './svg/heart.svg';
import { ProductContext } from './index';

import './ProductStore.scss';

class ProductStore extends Component<{}> {
  handleClick = (): void => {};
  render() {
    return (
      <ProductContext.Consumer>
        {({ store }: ProductStoreType) => (
          <div styleName="container">
            <div styleName="storeInfoWrapper">
              <div styleName="storeInfo">
                <div styleName="image" />
                <div>
                  <h5 styleName="storeName">{extractText(store.name)}</h5>
                  <Rating rating={store.rating} />
                </div>
              </div>
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
  }
}

export default ProductStore;
