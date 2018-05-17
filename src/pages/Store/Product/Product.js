import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import PropTypes from 'prop-types';
import {
  path,
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

import { extractText, isEmpty, log } from 'utils';

import {
  filterVariants,
  extractPhotos,
  extractPriceInfo,
  makeWidgets,
  differentiateWidgets,
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

import {
  ProductType,
  SelectedType,
  ThumbnailType,
  PriceInfo,
  WidgetOptionType,
} from './types';

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
        widgets: makeWidgets([])(all),
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
        label: 'Characteristics',
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
          // eslint-disable-next-line
          alert('Unable to add product to cart');
        },
      });
    } else {
      alert('Something went wrong :('); // eslint-disable-line
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
      photoMain,
      additionalPhotos: this.insertPhotoMain(photoMain, additionalPhotos),
    });
  };

  handleWidget = ({ id, label, state }: WidgetOptionType): void => {
    const pathToAll = ['baseProduct', 'variants', 'all'];
    const variants = path(pathToAll, this.props);
    const widgets = differentiateWidgets([{ id, value: label, state }])(
      variants,
    );
    this.setState({
      widgets,
    });
  };

  loggedIn() {
    const store = this.context.environment.getStore();
    const root = store.getSource().get('client:root');
    return !!path(['me', '__ref'], root);
  }

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
    const loggedIn = this.loggedIn();
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
              onWidgetClick={this.handleWidget}
            >
              <ProductPrice {...priceInfo} />
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
