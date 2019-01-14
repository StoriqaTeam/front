// @flow

import React, { PureComponent } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import xss from 'xss';
import { addressToString, getNameText } from 'utils';
import { HTMLEditor } from 'components/HTMLEditor';
import serializer from 'components/HTMLEditor/serializer';
import { Value } from 'slate';

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
    const modifLongDescription = longDescription
      ? longDescription.replace(/\n/g, '<hr />')
      : null;
    // $FlowIgnoreMe
    const address = addressToString(shop.addressFull);
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

            {modifLongDescription && (
              <div styleName="item">
                <div styleName="subtitle">{t.description}</div>
                <pre>
                  {JSON.stringify(
                    serializer.serialize(
                      Value.fromJSON(JSON.parse(modifLongDescription)),
                    ),
                  )}
                </pre>
                <div
                  styleName="description"
                  // eslint-disable-next-line
                  dangerouslySetInnerHTML={{
                    __html: xss(
                      `${serializer.serialize(
                        Value.fromJSON(JSON.parse(modifLongDescription)),
                      )}`,
                      {
                        whiteList: {
                          // img: ['src', 'style', 'sizes', 'srcset'],
                          iframe: [
                            'id',
                            'src',
                            'height',
                            'sizes',
                            'width',
                            'frameBorder',
                            'type',
                          ],
                          br: [],
                          hr: [],
                          div: ['style'],
                          span: ['style'],
                          u: ['style'],
                          ol: ['style'],
                          ul: ['style'],
                          code: ['style'],
                        },
                      },
                    ),
                  }}
                />
                {/* <HTMLEditor noHeight readOnly content={modifLongDescription} /> */}
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
