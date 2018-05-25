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
      crossPrice: null,
    },
  };
  handleAddToCart(id: number): void {
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
  render() {
    if (isNil(this.props.baseProduct)) {
      return (
        <div styleName="productNotFound">
          <h1>Product Not Found</h1>
        </div>
      );
    }
    const {
      baseProduct: { name, shortDescription, longDescription },
    } = this.props;
    const { widgets, productVariant } = this.state;
    const description = extractText(shortDescription, 'EN', 'No Description');
    return (
      <ProductContext.Provider value={this.props.baseProduct}>
        <div styleName="ProductDetails">
          <Row>
            <Col size={6}>
              <ProductImage
                discount={productVariant.discount}
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
                  wireframe
                  big
                  onClick={() => this.handleAddToCart(productVariant.rawId)}
                >
                  Add to cart
                </Button>
              </div>
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
