// @flow

import React, { PureComponent } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { addressToString, getNameText } from 'utils';

import ImageLoader from 'libs/react-image-loader';
import BannerLoading from 'components/Banner/BannerLoading';

import './About.scss';

type AddressFullType = {
  value: ?string,
  country: ?string,
  administrativeAreaLevel1: ?string,
  administrativeAreaLevel2: ?string,
  locality: ?string,
  political: ?string,
  postalCode: ?string,
  route: ?string,
  streetNumber: ?string,
  placeId: ?string,
};

type LangType = {
  lang: string,
  text: string,
};

type PropsType = {
  shop: {
    id: string,
    rawId: number,
    name: LangType,
    longDescription: LangType,
    addressFull: AddressFullType,
  },
};

class StoreAbout extends PureComponent<PropsType> {
  render() {
    const { shop } = this.props;
    const name = getNameText(shop.name, 'EN');
    const longDescription = getNameText(shop.longDescription, 'EN').replace(
      /\n/g,
      '<hr />',
    );
    const address = addressToString(shop.addressFull);
    return (
      <div styleName="container">
        <div styleName="title">
          <strong>About store</strong>
        </div>
        <div styleName="body">
          <div styleName="left">
            <div styleName="item">
              <div styleName="subtitle">Full shop name</div>
              <div>{name}</div>
            </div>
            <div styleName="item">
              <div styleName="subtitle">Location</div>
              <div>{address}</div>
            </div>
            <div styleName="item">
              <div styleName="subtitle">Description</div>
              <div
                styleName="description"
                dangerouslySetInnerHTML={{ __html: longDescription }} // eslint-disable-line
              />
            </div>
          </div>
          <div styleName="right">
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
          </div>
        </div>
      </div>
    );
  }
}

export default createFragmentContainer(
  StoreAbout,
  graphql`
    fragment StoreAbout_shop on Store {
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
