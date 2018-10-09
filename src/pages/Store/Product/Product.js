// @flow

import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { routerShape } from 'found';
import PropTypes from 'prop-types';
import xss from 'xss';
import { isNil, head, ifElse, assoc, dissoc, propEq, has, prop } from 'ramda';
import smoothscroll from 'libs/smoothscroll';

import { withErrorBoundary } from 'components/common/ErrorBoundaries';
import { AppContext, Page } from 'components/App';
import { SocialShare } from 'components/SocialShare';
import { Col, Row } from 'layout';
import { IncrementInCartMutation } from 'relay/mutations';
import { withShowAlert } from 'components/App/AlertContext';
import { extractText, isEmpty, log } from 'utils';

import type { AddAlertInputType } from 'components/App/AlertContext';

import {
  makeWidgets,
  filterVariantsByAttributes,
  attributesFromVariants,
  sortByProp,
  isNoSelected,
} from './utils';

import {
  ImageDetail,
  ProductBreadcrumbs,
  ProductButtons,
  ProductContext,
  ProductDetails,
  ProductImage,
  ProductStore,
  Tab,
  Tabs,
} from './index';

import type {
  ProductType,
  ProductVariantType,
  WidgetType,
  TabType,
  TranslationType,
} from './types';

import './Product.scss';

type PropsType = {
  showAlert: (input: AddAlertInputType) => void,
  baseProduct: ProductType,
  router: routerShape,
};

type StateType = {
  widgets: Array<WidgetType>,
  productVariant: ProductVariantType,
  unselectedAttr: ?Array<string>,
  selectedAttributes: {
    [string]: string,
  },
  availableAttributes: {
    [string]: Array<string>,
  },
  isAddToCart: boolean,
};

class Product extends Component<PropsType, StateType> {
  static getDerivedStateFromProps(
    nextProps: PropsType,
    prevState: StateType,
  ): ?StateType {
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
      return {
        ...prevState,
        widgets: makeWidgets(all),
        // $FlowIgnoreMe
        productVariant: head(all),
        availableAttributes: attributesFromVariants(all),
      };
    }
    return prevState;
  }
  constructor(props) {
    super(props);
    this.state = {
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
        quantity: 0,
        preOrder: false,
        preOrderDays: 0,
      },
      unselectedAttr: null,
      selectedAttributes: {},
      availableAttributes: {},
      isAddToCart: false,
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  handleAddToCart = (id: number) => {
    this.setState({ unselectedAttr: null });
    const { widgets, selectedAttributes } = this.state;
    const unselectedAttr = isNoSelected(
      sortByProp('id')(widgets),
      selectedAttributes,
    );

    if (isEmpty(widgets) || !unselectedAttr) {
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
            this.setState({ isAddToCart: true });
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
      this.setState({ unselectedAttr });
      smoothscroll.scrollTo(head(unselectedAttr));
    }
  };

  handleWidget = (item: {
    attributeId: string,
    attributeValue: string,
  }): void => {
    const {
      selectedAttributes: prevSelectedAttributes,
      availableAttributes: prevAvailableAttributes,
    } = this.state;

    const isUnselect = propEq(
      item.attributeId,
      item.attributeValue,
      prevSelectedAttributes,
    );

    const selectedAttributes = ifElse(
      propEq(item.attributeId, item.attributeValue),
      dissoc(item.attributeId),
      assoc(item.attributeId, item.attributeValue),
    )(prevSelectedAttributes);

    const {
      baseProduct: {
        variants: { all: variants },
      },
    } = this.props;

    const matchedVariants = filterVariantsByAttributes(
      selectedAttributes,
      variants,
    );

    const availableAttributes = attributesFromVariants(matchedVariants);

    this.setState({
      selectedAttributes,
      availableAttributes: isUnselect
        ? availableAttributes
        : assoc(
            item.attributeId,
            prop(item.attributeId, prevAvailableAttributes),
            availableAttributes,
          ),
      // $FlowIgnoreMe
      productVariant: head(matchedVariants),
      isAddToCart: false,
    });
  };

  makeTabs = (longDescription: Array<TranslationType>) => {
    const modifLongDescription = extractText(
      longDescription,
      'EN',
      'No Long Description',
    ).replace(/\n/g, '<hr />');
    const tabs: Array<TabType> = [
      {
        id: '0',
        label: 'Description',
        content: (
          <div
            styleName="longDescription"
            // eslint-disable-next-line
            dangerouslySetInnerHTML={{
              __html: xss(`${modifLongDescription}`, {
                whiteList: {
                  img: ['src', 'style', 'sizes', 'srcset'],
                  br: [],
                  div: ['style'],
                },
              }),
            }}
          />
        ),
      },
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
    const { baseProduct } = this.props;
    const { unselectedAttr } = this.state;
    if (isNil(baseProduct)) {
      return <div styleName="productNotFound">Product Not Found</div>;
    }
    if (isNil(baseProduct.store)) {
      return <div styleName="productNotFound">Store Not Found</div>;
    }
    const {
      baseProduct: {
        name,
        categoryId,
        shortDescription,
        longDescription,
        rating,
        store,
      },
      router,
    } = this.props;
    const {
      widgets,
      productVariant,
      selectedAttributes,
      availableAttributes,
      isAddToCart,
    } = this.state;
    const description = extractText(shortDescription, 'EN', 'No Description');
    return (
      <AppContext.Consumer>
        {({ categories }) => (
          <ProductContext.Provider value={{ store, productVariant, rating }}>
            <div styleName="container">
              {has('children')(categories) && !isNil(categories.children) ? (
                <ProductBreadcrumbs
                  categories={categories.children}
                  categoryId={categoryId}
                />
              ) : null}
              <div styleName="productContent">
                <Row>
                  <Col sm={12} md={12} lg={6} xl={6}>
                    <ProductImage {...productVariant} />
                    <ImageDetail />
                    {process.env.BROWSER ? (
                      <SocialShare noBorderX big {...productVariant} />
                    ) : null}
                  </Col>
                  <Col sm={12} md={12} lg={6} xl={6}>
                    <div styleName="detailsWrapper">
                      <ProductDetails
                        productTitle={extractText(name)}
                        productDescription={description}
                        widgets={widgets}
                        selectedAttributes={selectedAttributes}
                        availableAttributes={availableAttributes}
                        onWidgetClick={this.handleWidget}
                        unselectedAttr={unselectedAttr}
                        productVariant={productVariant}
                      >
                        <ProductButtons
                          onAddToCart={() =>
                            this.handleAddToCart(productVariant.rawId)
                          }
                          unselectedAttr={unselectedAttr}
                          quantity={productVariant.quantity}
                          preOrder={productVariant.preOrder}
                          preOrderDays={productVariant.preOrderDays}
                          isAddToCart={isAddToCart}
                          router={router}
                        />
                        <div styleName="line" />
                        <ProductStore />
                      </ProductDetails>
                    </div>
                  </Col>
                </Row>
              </div>
              {this.makeTabs(longDescription)}
            </div>
          </ProductContext.Provider>
        )}
      </AppContext.Consumer>
    );
  }
}

export default createFragmentContainer(
  withShowAlert(withErrorBoundary(Page(Product, true))),
  graphql`
    fragment Product_baseProduct on BaseProduct {
      id
      categoryId
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
        rawId
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
          preOrder
          preOrderDays
          cashback
          discount
          quantity
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
