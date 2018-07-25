// @flow

import React from 'react';

import { Rating } from 'components/common/Rating';
import { Icon } from 'components/Icon';
import ImageLoader from 'libs/react-image-loader';
import BannerLoading from 'components/Banner/BannerLoading';

import { StoreContext } from './index';

import './StoreHeaderInfo.scss';

const StoreHeader = () => (
  <StoreContext.Consumer>
    {({ logo, name, rating }) => (
      <div styleName="container">
        <span styleName="controls">
          <Icon type="controls" size={20} />
        </span>
        <span styleName="magnifier">
          <Icon type="magnifier" size={20} />
        </span>
        <figure styleName="shopLogo">
          {logo ? (
            <ImageLoader fit src={logo} loader={<BannerLoading />} />
          ) : (
            <Icon type="camera" size="56" />
          )}
        </figure>
        <div>
          <h2 styleName="shopTitle">
            {name}
            <span styleName="cartIcon">
              <Icon type="verifiedShop" size={20} />
            </span>
          </h2>
          <div styleName="shopRating">
            <div styleName="rating">
              <Rating value={rating} />
            </div>
            <span styleName="reviews">380 Reviews</span>
          </div>
        </div>
      </div>
    )}
  </StoreContext.Consumer>
);

export default StoreHeader;
