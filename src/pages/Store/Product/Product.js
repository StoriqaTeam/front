import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import PropTypes from 'prop-types';
import {
  path,
  head,
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
  makeWidgets,
  differentiateWidgets,
  getVariantFromSelection,
} from './utils';

import {
  ProductPrice,
  ProductImage,
  ProductShare,
  ProductDetails,
  ProductContext,
  ProductStore,
  Tab,
  Tabs,
  TabRow,
} from './index';

import {
  ProductType,
  ThumbnailType,
  PriceInfo,
  WidgetOptionType,
  ProductVariantType,
} from './types';

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
  productVariant: ProductVariantType,
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
    if (isNil(nextProps.baseProduct)) {
      return null;
    }
    const {
      baseProduct: {
        variants: { all },
      },
    } = nextProps;
    const { widgets } = prevState;
    if (isEmpty(widgets)) {
      const madeWidgets = makeWidgets([])(all);
      const productVariant = getVariantFromSelection([])(all);
      return {
        tabs: prevState.tabs,
        widgets: madeWidgets,
        productVariant,
      };
    }
    return prevState;
  }
  state = {
    tabs: [
      {
        id: 0,
        label: 'Characteristics',
        content: <TabRow row={mockData.row} />,
      },
    ],
    widgets: [],
    productVariant: {},
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
    if (!this.loggedIn()) {
      return;
    }

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
  handleWidget = ({ id, label, state, variantIds }: WidgetOptionType): void => {
    const selection = [{ id, value: label, state, variantIds }];
    const pathToAll = ['baseProduct', 'variants', 'all'];
    const variants = path(pathToAll, this.props);
    const productVariant = getVariantFromSelection(selection)(variants);
    const widgets = differentiateWidgets(selection)(variants);
    this.setState({
      widgets,
      productVariant,
    });
  };
  loggedIn() {
    const store = this.context.environment.getStore();
    const root = store.getSource().get('client:root');
    return !!path(['me', '__ref'], root);
  }
  render() {
    if (isNil(this.props.baseProduct)) {
      return (
        <div styleName="productNotFound">
          <h1>Product Not Found</h1>
        </div>
      );
    }
    const {
      baseProduct: { name, longDescription },
    } = this.props;
    const { tabs, widgets, productVariant } = this.state;
    const loggedIn = this.loggedIn();
    const description = extractText(longDescription, 'EN', 'No Description');
    return (
      <ProductContext.Provider value={this.props.baseProduct}>
        <div styleName="ProductDetails">
          <Row>
            <Col size={6}>
              <ProductImage
                mainImage={productVariant.photoMain}
                thumbnails={productVariant.additionalPhotos}
              />
              {process.env.BROWSER ? (
                <ProductShare
                  photoMain={productVariant.photoMain}
                  description={productVariant.description}
                />
              ) : null}
            </Col>
            <Col size={6}>
              <ProductDetails
                productTitle={extractText(name)}
                productDescription={description}
                widgets={widgets}
                onWidgetClick={this.handleWidget}
              >
                <ProductPrice
                  price={productVariant.price}
                  crossPrice={productVariant.crossPrice}
                  cashback={productVariant.cashback}
                />
              </ProductDetails>
              <div styleName="buttons-container">
                <Button disabled big>
                  Buy now
                </Button>
                <Button
                  wireframe={loggedIn}
                  big
                  disabled={!loggedIn}
                  onClick={() => this.handleAddToCart()}
                >
                  Add to cart
                </Button>
              </div>
              <ProductStore />
              {/* {!loggedIn && <div>Please login to use cart</div>} */}
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
      </ProductContext.Provider>
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
      store {
        name {
          lang
          text
        }
        rating
        productsCount
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
