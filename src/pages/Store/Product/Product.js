// @flow

import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import PropTypes from 'prop-types';
import { path, isNil, head, has } from 'ramda';
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
  differentiateWidgets,
  getVariantFromSelection,
  isNoSelected,
  sortByProp,
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
  unselectedAttr: ?Array<string>,
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
        ...prevState,
        widgets: madeWidgets,
        productVariant,
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
        lastPrice: null,
      },
      unselectedAttr: null,
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  handleAddToCart(id: number): void {
    const { widgets } = this.state;
    const unselectedAttr = isNoSelected(sortByProp('id')(widgets));
    // return;
    if ((id && !unselectedAttr) || (id && widgets.length === 0)) {
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
      this.setState({ unselectedAttr });
      smoothscroll.scrollTo(head(unselectedAttr));
    }
  }
  handleWidget = (props: WidgetOptionType): void => {
    if (props) {
      const { id, label, state, variantIds } = props;
      const selection = [{ id, value: label, state, variantIds }];
      const pathToAll = ['baseProduct', 'variants', 'all'];
      const variants = path(pathToAll, this.props);
      const productVariant = getVariantFromSelection(selection)(variants);
      const widgets = differentiateWidgets(selection)(variants);
      this.setState((prevState: StateType) => ({
        widgets,
        productVariant,
        unselectedAttr:
          prevState.unselectedAttr === null ? null : isNoSelected(widgets),
      }));
    }
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
    const { unselectedAttr } = this.state;
    if (isNil(this.props.baseProduct)) {
      return <div styleName="productNotFound">Product Not Found</div>;
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
    } = this.props;
    const { widgets, productVariant } = this.state;
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
                        onWidgetClick={this.handleWidget}
                        unselectedAttr={unselectedAttr}
                      >
                        <ProductButtons
                          onAddToCart={() =>
                            this.handleAddToCart(productVariant.rawId)
                          }
                          unselectedAttr={unselectedAttr}
                        />
                        <div styleName="line" />
                        <ProductStore />
                        {/* {!loggedIn && <div>Please login to use cart</div>} */}
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
