// @flow

import React, { Fragment } from 'react';

import { SocialShare } from 'components/SocialShare';
import { Icon } from 'components/Icon';
import ImageLoader from 'libs/react-image-loader';
import BannerLoading from 'components/Banner/BannerLoading';
import MediaQuery from 'libs/react-responsive';
import { convertSrc } from 'utils';

import { StoreContext, StoreHeaderBottom, StoreHeaderTabs } from './index';

import './StoreHeader.scss';

const StoreHeader = () => (
  <StoreContext.Consumer>
    {({
      cover,
      tabs,
      storeId,
      active,
      facebookUrl,
      twitterUrl,
      instagramUrl,
    }) => (
      <header styleName="container">
        <div styleName="imageWrapper">
          <figure styleName="image">
            {cover ? (
              <Fragment>
                <MediaQuery maxWidth={575}>
                  <ImageLoader
                    fit
                    src={convertSrc(cover, 'medium')}
                    loader={<BannerLoading />}
                  />
                </MediaQuery>
                <MediaQuery maxWidth={991} minWidth={576}>
                  <ImageLoader
                    fit
                    src={convertSrc(cover, 'large')}
                    loader={<BannerLoading />}
                  />
                </MediaQuery>
                <MediaQuery minWidth={992}>
                  <ImageLoader fit src={cover} loader={<BannerLoading />} />
                </MediaQuery>
              </Fragment>
            ) : (
              <Icon type="camera" size={56} />
            )}
            <aside styleName="social">
              <h2 styleName="offscreen">Social Share</h2>
              {process.env.BROWSER ? (
                <SocialShare
                  facebookUrl={facebookUrl}
                  twitterUrl={twitterUrl}
                  instagramUrl={instagramUrl}
                />
              ) : null}
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
