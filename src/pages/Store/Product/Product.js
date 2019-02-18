// @flow

import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { routerShape } from 'found';
import uuidv4 from 'uuid/v4';
import PropTypes from 'prop-types';
import {
  isNil,
  head,
  ifElse,
  assoc,
  dissoc,
  propEq,
  has,
  pathOr,
  find,
  toUpper,
  forEach,
  isEmpty,
} from 'ramda';
import { Environment } from 'relay-runtime';
import smoothscroll from 'libs/smoothscroll';
import MediaQuery from 'libs/react-responsive';

import { withErrorBoundary } from 'components/common/ErrorBoundaries';
import { AppContext, Page } from 'components/App';
import { Col, Row } from 'layout';
import { AddInCartMutation } from 'relay/mutations';
import { withShowAlert } from 'components/Alerts/AlertContext';
import {
  extractText,
  log,
  convertCountries,
  sanitizeHTML,
  checkCurrencyType,
  setCookie,
} from 'utils';
import { productViewTracker, addToCartTracker } from 'rrHalper';

import type { AddAlertInputType } from 'components/Alerts/AlertContext';

import RRElement from './RRElement';
import {
  makeWidgets,
  filterVariantsByAttributes,
  attributesFromVariants,
  availableAttributesFromVariants,
  sortByProp,
  isNoSelected,
} from './utils';

import {
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
  VariantType,
  WidgetType,
  TabType,
  TranslationType,
  DeliveryAddress,
  DeliveryDataType,
} from './types';

import './Product.scss';

import t from './i18n';

type PropsType = {
  me: {
    id: string,
    rawId: number,
    phone: ?string,
    firstName: string,
    lastName: string,
    deliveryAddressesFull: ?Array<DeliveryAddress>,
  },
  showAlert: (input: AddAlertInputType) => void,
  baseProduct: ProductType,
  router: routerShape,
  relay: {
    environment: Environment,
  },
};

type StateType = {
  widgets: Array<WidgetType>,
  productVariant: ?VariantType,
  unselectedAttr: ?Array<string>,
  selectedAttributes: {
    [string]: string,
  },
  availableAttributes: {
    [string]: Array<string>,
  },
  isAddToCart: boolean,
  isLoading: boolean,
  isLoadingAddToCart: boolean,
  cartQuantity: number,
  deliveryData: DeliveryDataType,
};

class Product extends Component<PropsType, StateType> {
  constructor(props) {
    super(props);
    this.state = this.getDefaultState();
  }

  componentDidMount() {
    const { productVariant, widgets } = this.state;
    const attributes = productVariant ? productVariant.attributes : [];

    if (productVariant) {
      // $FlowIgnore
      const storeId = pathOr('', ['match', 'params', 'storeId'], this.props);
      // $FlowIgnore
      const productId = pathOr(
        '',
        ['match', 'params', 'productId'],
        this.props,
      );
      this.props.router.replace(
        `/store/${storeId}/products/${productId}/variant/${
          productVariant.rawId
        }`,
      );
      this.setProductViewTracker(productVariant.rawId);
    }

    const selectedAttributes = {};

    forEach(attr => {
      const { value, attribute } = attr;
      const result = find(propEq('id', attribute.id))(widgets);

      if (!isNil(result)) {
        selectedAttributes[attribute.id] = value;
      }
    }, attributes);
    // eslint-disable-next-line
    this.setState({ selectedAttributes });
  }

  componentDidUpdate(prevProps, prevState) {
    const { productVariant } = this.state;
    // $FlowIgnore
    const storeId = pathOr('', ['match', 'params', 'storeId'], this.props);
    // $FlowIgnore
    const productId = pathOr('', ['match', 'params', 'productId'], this.props);
    if (
      productVariant &&
      prevState.productVariant &&
      productVariant.rawId !== prevState.productVariant.rawId
    ) {
      this.props.router.replace(
        `/store/${storeId}/products/${productId}/variant/${
          productVariant.rawId
        }`,
      );
      this.setProductViewTracker(productVariant.rawId);
    }

    // $FlowIgnore
    const prevProductId = pathOr(
      '',
      ['match', 'params', 'productId'],
      prevProps,
    );
    if (productId !== prevProductId) {
      this.updateState(this.getDefaultState());
    }
  }

  getDefaultState = () => {
    const { baseProduct } = this.props;
    const variants = baseProduct ? baseProduct.variants.all : [];
    // $FlowIgnore
    const variantId = pathOr('', ['match', 'params', 'variantId'], this.props);
    let productVariant = !isEmpty(variants) ? head(variants) : null;

    if (variantId) {
      const matchProductVariant = find(
        propEq('rawId', parseInt(variantId, 10)),
      )(variants);
      if (matchProductVariant) {
        productVariant = matchProductVariant;
      }
    }
    return {
      widgets: makeWidgets(variants),
      productVariant,
      unselectedAttr: null,
      selectedAttributes: {},
      availableAttributes: attributesFromVariants(variants),
      isAddToCart: false,
      isLoading: false,
      isLoadingAddToCart: false,
      cartQuantity: 1,
      deliveryData: {
        deliveryPackage: null,
        country: null,
        deliveryPackages: [],
      },
    };
  };

  setProductViewTracker = (id: number) => {
    if (process.env.BROWSER && process.env.REACT_APP_RRPARTNERID && id) {
      productViewTracker(id);
    }
  };

  getUserAddress = () => {
    const { me } = this.props;
    let userAddress = null;
    if (me) {
      const { deliveryAddressesFull } = me;
      if (deliveryAddressesFull && !isEmpty(deliveryAddressesFull)) {
        userAddress =
          find(propEq('isPriority', true))(deliveryAddressesFull) ||
          head(deliveryAddressesFull);
      }
    }
    return userAddress;
  };

  updateState = (state: StateType) => {
    this.setState(state);
  };

  handleChangeQuantity = (quantity: number) => {
    this.setState({ cartQuantity: quantity });
  };

  handleChangeDeliveryData = (deliveryData: DeliveryDataType) => {
    this.setState({ deliveryData });
  };

  handleAddToCart = (id: number) => {
    this.setState({ unselectedAttr: null });
    const {
      widgets,
      selectedAttributes,
      cartQuantity,
      deliveryData,
    } = this.state;
    const unselectedAttr = isNoSelected(
      sortByProp('id')(widgets),
      selectedAttributes,
    );

    if (isEmpty(widgets) || !unselectedAttr) {
      const { baseProduct } = this.props;
      const sellerCurreny = baseProduct.currency;
      const sellerCurrenyType = checkCurrencyType(sellerCurreny);
      const shippingId = deliveryData.deliveryPackage
        ? deliveryData.deliveryPackage.shippingId
        : null;

      this.setState({ isLoadingAddToCart: true });

      AddInCartMutation.commit({
        input: {
          clientMutationId: uuidv4(),
          productId: id,
          value: cartQuantity,
          shippingId,
        },
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
              text: t.productAddedToCart,
              link: { text: '' },
            });
            this.setState({ isAddToCart: true }, () => {
              setCookie('CURRENCY_TYPE', toUpper(sellerCurrenyType));
            });
            this.setState({ isLoadingAddToCart: false });
          }
        },
        onError: error => {
          this.setState({ isLoadingAddToCart: false });
          log.error('Error in IncrementInCart mutation');
          log.error(error);
          this.props.showAlert({
            type: 'danger',
            text: t.unableToAddProductToCart,
            link: { text: t.close },
          });
        },
      });
    } else {
      this.setState({ unselectedAttr });
      if (!isEmpty(unselectedAttr) && head(unselectedAttr)) {
        smoothscroll.scrollTo(head(unselectedAttr));
      }
    }
  };

  handleWidget = (item: {
    attributeId: string,
    attributeValue: string,
  }): void => {
    const { selectedAttributes: prevSelectedAttributes } = this.state;

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

    if (isEmpty(matchedVariants)) {
      return;
    }

    const availableAttributes = availableAttributesFromVariants(
      selectedAttributes,
      variants,
    );

    this.setState({
      selectedAttributes,
      availableAttributes,
      productVariant: head(matchedVariants),
      isAddToCart: false,
    });
  };

  makeTabs = (longDescription: Array<TranslationType>) => {
    const modifLongDescription = extractText(
      longDescription,
      'EN',
      t.noLongDescription,
    ).replace(/\n/g, '<hr />');
    /* eslint-disable no-underscore-dangle */
    const __html = sanitizeHTML(modifLongDescription);
    const tabs: Array<TabType> = [
      {
        id: '0',
        label: 'Description',
        content: (
          <div
            styleName="longDescription"
            // eslint-disable-next-line
            dangerouslySetInnerHTML={{
              __html,
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

  handleBuyNow = () => {
    const {
      widgets,
      selectedAttributes,
      cartQuantity,
      productVariant,
      deliveryData,
    } = this.state;

    if (!productVariant) {
      return;
    }

    this.setState({ unselectedAttr: null });
    const unselectedAttr = isNoSelected(
      sortByProp('id')(widgets),
      selectedAttributes,
    );

    let quantity = cartQuantity;

    if (
      productVariant.quantity === 0 &&
      productVariant.preOrder &&
      productVariant.preOrderDays > 0
    ) {
      quantity = 1;
    }

    if (isEmpty(widgets) || !unselectedAttr) {
      const userAddress = this.getUserAddress();
      // $FlowIgnore
      const userCountryCode = pathOr(
        null,
        ['address', 'countryCode'],
        userAddress,
      );
      // $FlowIgnore
      const deliveryCountryCode = pathOr(null, ['country', 'id'], deliveryData);
      const isDeliveryQuery = Boolean(
        userCountryCode &&
          deliveryCountryCode &&
          userCountryCode === deliveryCountryCode,
      );
      // $FlowIgnore
      const baseProductRawId = pathOr(
        null,
        ['baseProduct', 'rawId'],
        this.props,
      );
      this.props.router.push(
        `/buy-now?product=${baseProductRawId}&variant=${
          productVariant.rawId
        }&quantity=${quantity}${
          deliveryData.deliveryPackage && isDeliveryQuery
            ? `&delivery=${deliveryData.deliveryPackage.shippingId}`
            : ''
        }${
          deliveryData.deliveryPackage &&
          deliveryData.country &&
          isDeliveryQuery
            ? `&country=${deliveryData.country.id}`
            : ''
        }`,
      );
    } else {
      this.setState({ unselectedAttr });
      if (!isEmpty(unselectedAttr) && head(unselectedAttr)) {
        smoothscroll.scrollTo(head(unselectedAttr));
      }
    }
  };

  handleAddToCartTracker = () => {
    const { productVariant } = this.state;
    if (
      process.env.BROWSER &&
      process.env.REACT_APP_RRPARTNERID &&
      productVariant &&
      productVariant.rawId
    ) {
      addToCartTracker(productVariant.rawId);
    }
  };

  render() {
    const { me, baseProduct, router } = this.props;
    const { unselectedAttr, isLoadingAddToCart, productVariant } = this.state;
    if (isNil(baseProduct) || isNil(productVariant)) {
      return <div styleName="productNotFound">{t.productNotFound}</div>;
    }
    if (isNil(baseProduct.store)) {
      return <div styleName="productNotFound">{t.storeNotFound}</div>;
    }
    const {
      name,
      categoryId,
      shortDescription,
      longDescription,
      rating,
      store,
    } = baseProduct;
    const {
      widgets,
      selectedAttributes,
      availableAttributes,
      isAddToCart,
      isLoading,
      cartQuantity,
      deliveryData,
    } = this.state;
    const description = extractText(shortDescription, 'EN', t.noDescription);
    const userAddress = this.getUserAddress();
    return (
      <AppContext.Consumer>
        {({ categories, directories }) => (
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
                  <Col sm={12} md={7} lg={6} xl={7}>
                    <ProductImage {...productVariant} />
                    <MediaQuery minWidth={768}>
                      {this.makeTabs(longDescription)}
                    </MediaQuery>
                  </Col>
                  <Col sm={12} md={5} lg={6} xl={5}>
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
                        cartQuantity={cartQuantity}
                        onChangeQuantity={this.handleChangeQuantity}
                        userAddress={userAddress}
                        baseProductRawId={baseProduct.rawId}
                        countries={convertCountries(directories.countries)}
                        onChangeDeliveryData={this.handleChangeDeliveryData}
                        deliveryData={deliveryData}
                      >
                        <ProductButtons
                          onAddToCart={() =>
                            this.handleAddToCart(productVariant.rawId)
                          }
                          onBuyNow={this.handleBuyNow}
                          onAddToCartTracker={this.handleAddToCartTracker}
                          unselectedAttr={unselectedAttr}
                          quantity={productVariant.quantity}
                          preOrder={productVariant.preOrder}
                          preOrderDays={productVariant.preOrderDays}
                          isAddToCart={isAddToCart}
                          router={router}
                          isLoading={isLoading}
                          isLoadingAddToCart={isLoadingAddToCart}
                          isDisabledBuyNowButton={!me}
                        />
                        <div styleName="line" />
                        <ProductStore />
                      </ProductDetails>
                      <MediaQuery maxWidth={767}>
                        {this.makeTabs(longDescription)}
                      </MediaQuery>
                    </div>
                    <MediaQuery minWidth={992}>
                      <div styleName="rrBlock">
                        <RRElement productId={baseProduct.rawId} />
                      </div>
                    </MediaQuery>
                  </Col>
                </Row>
              </div>
              <MediaQuery maxWidth={991}>
                <div styleName="rrBlock">
                  <RRElement productId={baseProduct.rawId} fullWidth />
                </div>
              </MediaQuery>
            </div>
          </ProductContext.Provider>
        )}
      </AppContext.Consumer>
    );
  }
}

export default createFragmentContainer(
  // $FlowIgnoreMe
  withShowAlert(withErrorBoundary(Page(Product))),
  graphql`
    fragment Product_baseProduct on BaseProduct {
      isShippingAvailable
      id
      rawId
      currency
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
      store(visibility: "active") {
        rawId
        name {
          lang
          text
        }
        rating
        productsCount
        logo
        facebookUrl
        twitterUrl
        instagramUrl
      }
      rating
      variants {
        all {
          id
          rawId
          photoMain
          additionalPhotos
          price
          currency
          customerPrice {
            price
            currency
          }
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
