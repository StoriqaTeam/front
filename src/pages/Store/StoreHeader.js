// @flow

import React from 'react';

import { SocialShare } from 'components/SocialShare';

import { StoreContext, StoreHeaderBottom, StoreHeaderTabs } from './index';

import './StoreHeader.scss';

const StoreHeader = () => (
  <StoreContext.Consumer>
    {({ image, tabs }) => (
      <header styleName="container">
        <div styleName="imageWrapper">
          <figure styleName="image">
            <img src={image} alt="storiqa's shop" />
            <aside styleName="social">
              <h2 styleName="offscreen">Social Share</h2>
              {process.env.BROWSER ? <SocialShare /> : null}
            </aside>
          </figure>
        </div>
        <StoreHeaderBottom />
        <StoreHeaderTabs tabs={tabs} />
      </header>
    )}
  </StoreContext.Consumer>
);

export default StoreHeader;
