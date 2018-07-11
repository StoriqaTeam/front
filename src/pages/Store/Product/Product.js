// @flow

import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import PropTypes from 'prop-types';
import { path, isNil } from 'ramda';
import { Button } from 'components/common/Button';
import { withErrorBoundary } from 'components/common/ErrorBoundaries';
import { Page } from 'components/App';
import { Col, Row } from 'layout';
import { IncrementInCartMutation } from 'relay/mutations';
import { withShowAlert } from 'components/App/AlertContext';
import { extractText, isEmpty, log } from 'utils';
import { Rating } from 'components/common/Rating';

import type { AddAlertInputType } from 'components/App/AlertContext';

import {
  makeWidgets,
  differentiateWidgets,
  getVariantFromSelection,
  isSelected,
} from './utils';

import {
  ProductContext,
  ProductDetails,
  ProductImage,
  ProductPrice,
  ProductShare,
  ProductStore,
  ProductThumbnails,
  Tab,
  Tabs,
  // TabRow,
} from './index';

import type {
  ProductType,
  WidgetOptionType,
  ProductVariantType,
  WidgetType,
  TabType,
  TranslationType,
} from './types';

import './Product.scss';
// import mockData from './mockData.json';

type PropsType = {
  showAlert: (input: AddAlertInputType) => void,
  baseProduct: ProductType,
};

type StateType = {
  widgets: Array<WidgetType>,
  productVariant: ProductVariantType,
  selected?: string,
};

class Product extends Component<PropsType, StateType> {
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
        widgets: madeWidgets,
        productVariant,
        // selected: !isEmpty(selected) ? '' : selected,
      };
    }
    return prevState;
  }
  state: StateType = {
    widgets: [],
    productVariant: {
      id: '',
      rawId: 0,
      description: '',
      photoMain: '',
      additionalPhotos: null,
      price: 0,
      cashback: null,
      discount: null,
      lastPrice: null,
    },
    selected: '',
  };
  componentDidMount() {
    if (process.env.BROWSER) {
      setTimeout(() => {
        // HACK because 'window.scrollTo(0, 0)' doesn't work
        // $FlowFixMe
        document.getElementById('root').scrollTop = 0;
      }, 0);
    }
  }
  handleAddToCart(id: number): void {
    const { widgets } = this.state;
    if ((id && isSelected(widgets)) || (id && widgets.length === 0)) {
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
          if (!errors && response) {
            this.props.showAlert({
              type: 'success',
              text: 'Product added to cart!',
              link: { text: '' },
            });
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
      const message = !isSelected(widgets)
        ? 'You must select an attribute'
        : 'Something went wrong :(';
      this.props.showAlert({
        type: 'danger',
        text: message,
        link: { text: 'Close.' },
      });
      const errorMessage = !isSelected(widgets)
        ? 'Unable to add an item without selected attribute'
        : 'Unable to add an item without productId';
      log.error(errorMessage);
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
  makeTabs = (longDescription: Array<TranslationType>) => {
    const tabs: Array<TabType> = [
      {
        id: '0',
        label: 'Description',
        content: (
          <div>{extractText(longDescription, 'EN', 'No Long Description')}</div>
        ),
      },
      /* {
        id: '1',
        label: 'Characteristics',
        content: <TabRow row={mockData.row} />,
      }, */
    ];
    return (
      <Tabs>
        {tabs.map(({ id, label, content }) => (
          <Tab key={id} label={label}>
            {content}
          </Tab>
        ))}
      </Tabs>
    );
  };
  handleThumbnailClick = ({ image }: WidgetOptionType): void => {
    this.setState({ selected: image });
  };
  render() {
    if (isNil(this.props.baseProduct)) {
      return (
        <div styleName="productNotFound">
          <h1>Product Not Found</h1>
        </div>
      );
    }
    const {
      baseProduct: { name, shortDescription, longDescription, rating },
    } = this.props;
    const { widgets, productVariant, selected } = this.state;
    const description = extractText(shortDescription, 'EN', 'No Description');
    const isAdditionalPhotosEmpty = !isEmpty(productVariant.additionalPhotos);
    return (
      <ProductContext.Provider value={this.props.baseProduct}>
        <div styleName="ProductDetails">
          <Row>
            <Col size={1} sm={1} md={1} lg={1} xl={1}>
              <div
                styleName={
                  isAdditionalPhotosEmpty ? 'thumbnailsWrapper' : 'noWrapper'
                }
              >
                {isAdditionalPhotosEmpty ? (
                  <ProductThumbnails
                    isFirstSelected
                    isReset={isEmpty(selected)}
                    onClick={this.handleThumbnailClick}
                    options={productVariant.additionalPhotos}
                  />
                ) : null}
              </div>
            </Col>
            <Col sm={12} md={5} lg={5} xl={5}>
              <ProductImage selected={selected} {...productVariant} />
              {process.env.BROWSER ? (
                <ProductShare {...productVariant} />
              ) : null}
            </Col>
            <Col sm={12} md={6} lg={6} xl={6}>
              <ProductDetails
                productTitle={extractText(name)}
                productDescription={description}
                widgets={widgets}
                onWidgetClick={this.handleWidget}
              >
                <div styleName="rating">
                  <Rating value={rating} />
                </div>
                <ProductPrice
                  price={productVariant.price}
                  lastPrice={productVariant.lastPrice}
                  cashback={productVariant.cashback}
                />
              </ProductDetails>
              <div styleName="buttons-container">
                <Button disabled big>
                  Buy now
                </Button>
                <Button
                  id="productAddToCart"
                  wireframe
                  big
                  onClick={() => this.handleAddToCart(productVariant.rawId)}
                  dataTest="product-addToCart"
                >
                  Add to cart
                </Button>
              </div>
              <div styleName="line" />
              <ProductStore />
              {/* {!loggedIn && <div>Please login to use cart</div>} */}
            </Col>
          </Row>
          {this.makeTabs(longDescription)}
        </div>
      </ProductContext.Provider>
    );
  }
}

export default createFragmentContainer(
  withShowAlert(withErrorBoundary(Page(Product, true))),
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
        logo
      }
      rating
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
