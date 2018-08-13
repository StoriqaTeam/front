// @flow

import React, { PureComponent } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { addressToString, getNameText } from 'utils';

// import ImageLoader from 'libs/react-image-loader';
// import BannerLoading from 'components/Banner/BannerLoading';

import type { About_shop as AboutShopType } from './__generated__/About_shop.graphql';

import './About.scss';

type PropsType = {
  shop: AboutShopType,
};

class About extends PureComponent<PropsType> {
  render() {
    const { shop } = this.props;
    const name = getNameText(shop.name, 'EN');
    const longDescription = getNameText(shop.longDescription, 'EN');
    const modifLongDescription = longDescription
      ? longDescription.replace(/\n/g, '<hr />')
      : null;
    // $FlowIgnoreMe
    const address = addressToString(shop.addressFull);
    return (
      <div styleName="container">
        <div styleName="title">
          <strong>About store</strong>
        </div>
        <div styleName="body">
          <div styleName="left">
            {name && (
              <div styleName="item">
                <div styleName="subtitle">Full shop name</div>
                <div>{name}</div>
              </div>
            )}
            {address && (
              <div styleName="item">
                <div styleName="subtitle">Location</div>
                <div>{address}</div>
              </div>
            )}
            {modifLongDescription && (
              <div styleName="item">
                <div styleName="subtitle">Description</div>
                <div
                  styleName="description"
                  dangerouslySetInnerHTML={{ __html: modifLongDescription }} // eslint-disable-line
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
