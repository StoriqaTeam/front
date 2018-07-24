// @flow

import React from 'react';

import { StoreContext, StoreHeaderBottom } from './index';

import './StoreHeader.scss';

const StoreHeader = () => (
  <StoreContext.Consumer>
    {({ image }) => (
      <header styleName="container">
        <div styleName="imageWrapper">
          <figure styleName="image">
            <img src={image} alt="storiqa's shop" />
          </figure>
        </div>
        <StoreHeaderBottom />
      </header>
    )}
  </StoreContext.Consumer>
);

export default StoreHeader;
