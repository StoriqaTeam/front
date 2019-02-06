// @flow

import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { routerShape } from 'found';
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
} from 'ramda';
import { Environment } from 'relay-runtime';
import smoothscroll from 'libs/smoothscroll';
import MediaQuery from 'libs/react-responsive';
import uuidv4 from 'uuid/v4';

import { withErrorBoundary } from 'components/common/ErrorBoundaries';
import { AppContext, Page } from 'components/App';
import { Col, Row } from 'layout';
import { AddInCartMutation } from 'relay/mutations';
import { withShowAlert } from 'components/Alerts/AlertContext';
import {
  extractText,
  isEmpty,
  log,
  convertCountries,
  sanitizeHTML,
  checkCurrencyType,
  setCookie,
} from 'utils';
import { productViewTracker, addToCartTracker } from 'rrHalper';

import type { AddAlertInputType } from 'components/Alerts/AlertContext';

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
  ProductVariantType,
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
  productVariant: ProductVariantType,
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
        attributes: [],
      },
      unselectedAttr: null,
      selectedAttributes: {},
      availableAttributes: {},
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
  }

  componentDidMount() {
    // window.scrollTo(0, 0);
    const { baseProduct } = this.props;
    const { productVariant, widgets } = this.state;
    const { attributes } = productVariant;
    if (
      process.env.BROWSER &&
      process.env.REACT_APP_RRPARTNERID &&
      baseProduct &&
      baseProduct.rawId
    ) {
      productViewTracker(baseProduct.rawId);
    }

    const selectedAttributes = {};

    // eslint-disable-next-line
    attributes.map(attr => {
      // $FlowIgnore
      const { value, attribute } = attr;
      const result = find(propEq('id', attribute.id))(widgets);

      if (isNil(result)) {
        // eslint-disable-next-line
        return;
      }

      selectedAttributes[attribute.id] = value;
    });
    // eslint-disable-next-line
    this.setState({ selectedAttributes });
  }

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
      // $FlowIgnoreMe
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
    this.setState({ unselectedAttr: null });
    const {
      widgets,
      selectedAttributes,
      cartQuantity,
      productVariant,
      deliveryData,
    } = this.state;
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
    const { unselectedAttr, isLoadingAddToCart } = this.state;
    if (isNil(baseProduct)) {
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
      productVariant,
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
                  <Col sm={12} md={7} lg={7} xl={7}>
                    <ProductImage {...productVariant} />
                    <MediaQuery minWidth={768}>
                      {this.makeTabs(longDescription)}
                    </MediaQuery>
                  </Col>
                  <Col sm={12} md={5} lg={5} xl={5}>
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
                  </Col>
                </Row>
              </div>
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
