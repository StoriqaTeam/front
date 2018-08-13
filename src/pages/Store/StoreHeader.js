// @flow

import React from 'react';

import { SocialShare } from 'components/SocialShare';
import { Icon } from 'components/Icon';
import ImageLoader from 'libs/react-image-loader';
import BannerLoading from 'components/Banner/BannerLoading';

import { StoreContext, StoreHeaderBottom, StoreHeaderTabs } from './index';

import './StoreHeader.scss';

const StoreHeader = () => (
  <StoreContext.Consumer>
    {({ cover, tabs, storeId, active }) => (
      <header styleName="container">
        <div styleName="imageWrapper">
          <figure styleName="image">
            {cover ? (
              <ImageLoader fit src={cover} loader={<BannerLoading />} />
            ) : (
              <Icon type="camera" size="56" />
            )}
            <aside styleName="social">
              <h2 styleName="offscreen">Social Share</h2>
              {process.env.BROWSER ? <SocialShare /> : null}
            </aside>
          </figure>
        </div>
        <StoreHeaderBottom />
        <StoreHeaderTabs storeId={storeId} tabs={tabs} active={active} />
      </header>
    )}
  </StoreContext.Consumer>
);

export default StoreHeader;
