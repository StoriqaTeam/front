import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import PropTypes from 'prop-types';
import {
  propEq,
  filter,
  head,
  keys,
  insert,
  isNil,
  pathOr,
  defaultTo,
  prop,
  pipe,
} from 'ramda';
import { Button } from 'components/common/Button';
import { withErrorBoundary } from 'components/common/ErrorBoundaries';
import { Page } from 'components/App';
import { Col, Row } from 'layout';
import { IncrementInCartMutation } from 'relay/mutations';
import { withShowAlert } from 'components/App/AlertContext';

import { extractText, isEmpty, log } from 'utils';

import type { AddAlertInputType } from 'components/App/AlertContext';

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
  showAlert: (input: AddAlertInputType) => void,
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

  handleAddToCart() {
    // Todo for Jero - update this after refactoring (needed selected product id)
    const id = pipe(
      pathOr([], ['props', 'baseProduct', 'variants', 'all']),
      head,
      defaultTo({}),
      prop('rawId'),
    )(this);

    if (id) {
      IncrementInCartMutation.commit({
        input: { clientMutationId: '', productId: id },
        environment: this.context.environment,
        onCompleted: (response, errors) => {
          log.debug('Success for IncrementInCart mutation');
          if (response) {
            log.debug('Response: ', response);
          }
          if (errors) {
            log.debug('Errors: ', errors);
          }
        },
        onError: error => {
          log.error('Error in IncrementInCart mutation');
          log.error(error);
          this.props.showAlert({
            type: 'danger',
            text: 'Unable to add product to cart',
            link: { text: 'Close.' },
          });
        },
      });
    } else {
      this.props.showAlert({
        type: 'danger',
        text: 'Something went wrong :(',
        link: { text: 'Close.' },
      });
      log.error('Unable to add an item without productId');
    }
  }

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
            <div styleName="buttons-container">
              <Button disabled big>
                Buy now
              </Button>
              <Button wireframe big onClick={() => this.handleAddToCart()}>
                Add to cart
              </Button>
            </div>
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
  withShowAlert(withErrorBoundary(Page(Product))),
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
          rawId
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

Product.contextTypes = {
  environment: PropTypes.object.isRequired,
};
