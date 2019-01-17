// @flow

import React, { PureComponent } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import xss from 'xss';
import { addressToString, getNameText } from 'utils';

// import ImageLoader from 'libs/react-image-loader';
// import BannerLoading from 'components/Banner/BannerLoading';

import type { About_shop as AboutShopType } from './__generated__/About_shop.graphql';

import './About.scss';

import t from './i18n';

type PropsType = {
  shop: AboutShopType,
};

class About extends PureComponent<PropsType> {
  render() {
    const { shop } = this.props;
    const name = getNameText(shop.name, 'EN');
    const longDescription = getNameText(shop.longDescription, 'EN');
    // $FlowIgnoreMe
    const address = addressToString(shop.addressFull);
    /* eslint-disable no-underscore-dangle */
    const __html = xss(longDescription, {
      whiteList: {
        br: [],
        hr: [],
        a: ['class', 'style', 'href', 'target', 'rel'],
        p: ['class', 'style'],
        ol: ['class', 'style'],
        h1: ['class', 'style'],
        h2: ['class', 'style'],
        h3: ['class', 'style'],
        h4: ['class', 'style'],
        h5: ['class', 'style'],
        h6: ['class', 'style'],
        ul: ['class', 'style'],
        li: ['class', 'style'],
        em: ['class', 'style'],
        img: ['class', 'style', 'src', 'sizes', 'srcset', 'width', 'height'],
        sub: ['class', 'style'],
        sup: ['class', 'style'],
        div: ['class', 'style'],
        span: ['class', 'style'],
        strong: ['class', 'style'],
        iframe: ['class', 'style', 'src', 'width', 'height', 'frameborder'],
        table: ['class', 'style'],
        tr: ['class', 'style'],
        td: ['class', 'style'],
        tbody: ['class', 'style'],
        thead: ['class', 'style'],
      },
    });
    return (
      <div styleName="container">
        <div styleName="title">
          <strong>{t.aboutStore}</strong>
        </div>
        <div styleName="body">
          <div styleName="left">
            {name && (
              <div styleName="item">
                <div styleName="subtitle">{t.fullShopName}</div>
                <div>{name}</div>
              </div>
            )}
            {address && (
              <div styleName="item">
                <div styleName="subtitle">{t.location}</div>
                <div>{address}</div>
              </div>
            )}
            {longDescription && (
              <div styleName="item">
                <div styleName="subtitle">{t.description}</div>
                <div
                  styleName="description"
                  // eslint-disable-next-line
                  dangerouslySetInnerHTML={{
                    __html,
                  }}
                />
              </div>
            )}
          </div>
          {/* <div styleName="right">
            <div styleName="banners">
              <div styleName="banner">
                <ImageLoader
                  src="https://s3.amazonaws.com/storiqa-dev/img-0jRIr3M3cT0C.png"
                  loader={<BannerLoading />}
                />
              </div>
              <div styleName="banner">
                <ImageLoader
                  src="https://s3.amazonaws.com/storiqa-dev/img-wbAUMdeXXPgC.png"
                  loader={<BannerLoading />}
                />
              </div>
            </div>
          </div> */}
        </div>
      </div>
    );
  }
}

export default createFragmentContainer(
  About,
  graphql`
    fragment About_shop on Store {
      id
      rawId
      name {
        lang
        text
      }
      addressFull {
        value
        country
        administrativeAreaLevel1
        administrativeAreaLevel2
        locality
        political
        postalCode
        route
        streetNumber
        placeId
      }
      longDescription {
        lang
        text
      }
    }
  `,
);
