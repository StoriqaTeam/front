import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { propEq, filter, head, keys, insert, isNil } from 'ramda';
import { withErrorBoundary } from 'components/common/ErrorBoundaries';

import { Page } from 'components/App';
import { Col, Row } from 'layout';

import { extractText, isEmpty } from 'utils';

import {
  buildWidgets,
  filterVariants,
  compareWidgets,
  extractPhotos,
  extractPriceInfo,
} from './utils';

import {
  ProductPrice,
  ProductImage,
  ProductShare,
  ProductDetails,
  Tab,
  Tabs,
  TabRow,
} from './index';

import { ProductType, SelectedType, ThumbnailType, PriceInfo } from './types';

import './Product.scss';
import mockData from './mockData.json';

type PropsType = {
  baseProduct: ProductType,
};

type StateType = {
  tabs: Array<{ id: string | number, label: string, content: any }>,
  widgets: {},
  photoMain: string,
  additionalPhotos: Array<ThumbnailType>,
  priceInfo: PriceInfo,
};

class Product extends Component<PropsType, StateType> {
  /**
   * @static
   * @param {PropsType} nextProps
   * @param {StateType} prevState
   * @return {StateType | null}
   */
  static getDerivedStateFromProps(
    nextProps: PropsType,
    prevState: StateType,
  ): StateType | null {
    const {
      baseProduct: {
        variants: { all },
      },
    } = nextProps;
    const { widgets } = prevState;
    if (isEmpty(widgets)) {
      const { photoMain, additionalPhotos } = head(extractPhotos(all));
      const priceInfo = head(extractPriceInfo(all));
      return {
        tabs: prevState.tabs,
        widgets: buildWidgets(all),
        photoMain,
        additionalPhotos,
        priceInfo,
      };
    }
    return null;
  }
  state = {
    tabs: [
      {
        id: 0,
        label: 'Description',
        content: <TabRow row={mockData.row} />,
      },
    ],
    widgets: {},
    photoMain: '',
    additionalPhotos: [],
    priceInfo: {},
  };
  /**
   * @param {string} img
   * @param {Array<{id: string, img: string}>} photos
   * @return {ThumbnailType}
   */
  insertPhotoMain = (img: string, photos: ThumbnailType): ThumbnailType => {
    if (!isNil(img)) {
      return insert(0, { id: photos.length + 1, img, opacity: false }, photos);
    }
    return photos;
  };
  /**
   * @param {SelectedType} selected
   * @param {void} selected
   */
  handleWidgetClick = (selected: SelectedType): void => {
    const {
      baseProduct: {
        variants: { all },
      },
    } = this.props;
    const { widgets } = this.state;
    const filteredWidgets = filterVariants(all, selected.label);
    const filteredWidgetsHeadKeys = head(
      keys(filteredWidgets).map(key => filteredWidgets[key]),
    );
    let variantId = null;
    if (filteredWidgetsHeadKeys) {
      ({ variantId } = filteredWidgetsHeadKeys);
    }
    /**
     * @desc returns true if the object satisfies the 'id' property
     * @return {boolean}
     */
    const byId = propEq('id', variantId);
    const variantObj = head(filter(byId, extractPhotos(all)));
    let photoMain = '';
    let additionalPhotos = [];
    if (variantObj) {
      ({ photoMain, additionalPhotos } = variantObj);
    }
    this.setState({
      widgets: compareWidgets(filteredWidgets, widgets),
      photoMain,
      additionalPhotos: this.insertPhotoMain(photoMain, additionalPhotos),
    });
  };
  render() {
    const {
      baseProduct: { name, longDescription },
    } = this.props;
    const {
      tabs,
      widgets,
      photoMain,
      additionalPhotos,
      priceInfo,
    } = this.state;
    return (
      <div styleName="ProductDetails">
        <Row>
          <Col size={6}>
            <ProductImage mainImage={photoMain} thumbnails={additionalPhotos} />
            <ProductShare />
          </Col>
          <Col size={6}>
            <ProductDetails
              productTitle={extractText(name)}
              productDescription={extractText(
                longDescription,
                'EN',
                'No Description',
              )}
              widgets={widgets}
              onWidgetClick={this.handleWidgetClick}
            >
              <ProductPrice {...priceInfo} />
            </ProductDetails>
          </Col>
        </Row>
        <Tabs>
          {tabs.map(({ id, label, content }) => (
            <Tab key={id} label={label}>
              {content}
            </Tab>
          ))}
        </Tabs>
      </div>
    );
  }
}

export default createFragmentContainer(
  // $FlowIgnoreMe
  withErrorBoundary(Page(Product)),
  graphql`
    fragment Product_baseProduct on BaseProduct {
      id
      name {
        text
        lang
      }
      shortDescription {
        text
        lang
      }
      longDescription {
        text
        lang
      }
      variants {
        all {
          id
          photoMain
          additionalPhotos
          price
          cashback
          discount
          attributes {
            value
            metaField
            attribute {
              id
              name {
                text
                lang
              }
              metaField {
                values
                uiElement
              }
            }
          }
        }
      }
    }
  `,
);
