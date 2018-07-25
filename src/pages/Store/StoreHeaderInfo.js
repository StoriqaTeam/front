// @flow

import React from 'react';

import { Rating } from 'components/common/Rating';
import { Icon } from 'components/Icon';

import { StoreContext } from './index';

import './StoreHeaderInfo.scss';

const StoreHeader = () => (
  <StoreContext.Consumer>
    {({ logo }) => (
      <div styleName="container">
        <span styleName="controls">
          <Icon type="controls" size={20} />
        </span>
        <span styleName="magnifier">
          <Icon type="magnifier" size={20} />
        </span>
        <figure styleName="shopLogo">
          <img src={logo} alt="storiqa's shop" />
        </figure>
        <div>
          <h2 styleName="shopTitle">
            Shop Name{' '}
            <span styleName="cartIcon">
              <Icon type="verifiedShop" size={20} />
            </span>
          </h2>
          <div styleName="shopRating">
            <div styleName="rating">
              <Rating value={3} />
            </div>
            <span styleName="reviews">380 Reviews</span>
          </div>
        </div>
      </div>
    )}
  </StoreContext.Consumer>
);

export default StoreHeader;
