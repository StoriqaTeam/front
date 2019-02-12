// @flow

import React from 'react';
import { Route, RedirectException, Redirect } from 'found';
import { graphql } from 'react-relay';
import { find, pathEq, pathOr, last, isNil, pick } from 'ramda';

import { log, jwt as JWT, getCookie } from 'utils';
import { urlToInput } from 'utils/search';
import { App } from 'components/App';
import { Authorization, OAuthCallback } from 'components/Authorization';
import { Profile } from 'pages/Profile';
import Start from 'pages/Start/Start';
import { NewStore, EditStore } from 'pages/Manage/Store/Settings';
import { Products } from 'pages/Manage/Store/Products';
import { Storages } from 'pages/Manage/Store/Storages';
import { OrderInvoice } from 'pages/Manage/Store/OrderInvoice';
import {
  NewStorage,
  EditStorage,
  StorageProducts,
} from 'pages/Manage/Store/Storages/Storage';
import { Contacts } from 'pages/Manage/Store/Contacts';
import { Finances } from 'pages/Manage/Store/Finances';
import { Wizard } from 'pages/Manage/Wizard';
import Stores from 'pages/Stores/Stores';
import { NewProduct, EditProduct } from 'pages/Manage/Store/Products/Product';
import { Product as ProductCard } from 'pages/Store/Product';
import Categories from 'pages/Search/Categories';
import Cart from 'pages/Cart';
import Checkout from 'pages/Checkout';
import { BuyNow } from 'pages/BuyNow';
import { Error, Error404 } from 'pages/Errors';
import VerifyEmail from 'pages/VerifyEmail';
import { Logout } from 'pages/Logout';
import { StoreOrders, StoreOrder } from 'pages/Manage/Store/Orders';
import { Invoice } from 'pages/Profile/items/Order';
import { Store, StoreAbout, StoreItems, Showcase } from 'pages/Store';
import { StartSelling } from 'pages/StartSelling';
import { Login } from 'pages/Login';
import { PasswordReset } from 'pages/PasswordReset';
import {
  EmailConfirmed,
  DeviceConfirmed,
  PasswordResetDeny,
} from 'pages/Wallet';
import SpinnerPage from 'pages/SpinnerPage';

const routes = (
  <Route>
    <Route path="/ture/email_confirmed" Component={EmailConfirmed} />
    <Route path="/ture/password_reset_deny" Component={PasswordResetDeny} />
    <Route path="/ture/register_device_confirmed" Component={DeviceConfirmed} />
    <Route
      path="/"
      Component={App}
      query={graphql`
        query routes_App_Query {
          id
          me {
            id
            ...App_me
            wizardStore {
              id
              completed
            }
          }
          cart {
            id
            ...UserDataTotalLocalFragment
          }
          mainPage {
            ...Start_mainPage
          }
          countries {
            children {
              children {
                alpha3
                alpha2
                label
              }
            }
          }
          languages {
            isoCode
          }
          currencies
          fiatCurrencies
          cryptoCurrencies
          sellerCurrencies
          categories {
            name {
              lang
              text
            }
            children {
              id
              rawId
              parentId
              level
              name {
                lang
                text
              }
              children {
                id
                rawId
                parentId
                level
                name {
                  lang
                  text
                }
                children {
                  id
                  rawId
                  parentId
                  level
                  name {
                    lang
                    text
                  }
                  getAttributes {
                    id
                    rawId
                    name {
                      text
                      lang
                    }
                    metaField {
                      values
                      translatedValues {
                        translations {
                          text
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          orderStatuses
          currencyExchange {
            code
            rates {
              code
              value
            }
          }
        }
      `}
      render={args => {
        const { error, Component, props } = args;
        if (error) {
          log.error({ error });
          const errors = pathOr([], ['source', 'errors'], error);
          if (find(pathEq(['data', 'details', 'code'], '401'))(errors)) {
            return <Component {...props} />;
          }
        }
        return <Component {...props} />;
      }}
    >
      <Route path="/error" Component={Error} />
      <Route Component={Start} />
      <Route path="/404" Component={Error404} />

      <Route
        path="/cart"
        Component={Cart}
        query={graphql`
          query routes_Cart_Query {
            cart {
              ...Cart_cart
            }
          }
        `}
        prepareVariables={() => {
          const currencyType = getCookie('CURRENCY_TYPE');
          return {
            currencyType:
              currencyType === 'FIAT' || currencyType === 'CRYPTO'
                ? currencyType
                : 'FIAT',
          };
        }}
      />

      <Route
        path="/checkout"
        Component={Checkout}
        render={({ props, Component, resolving }) => {
          if (Component && resolving === true && props && !props.me) {
            const {
              location: { pathname },
            } = props;
            JWT.clearJWT();
            throw new RedirectException(`/login?from=${pathname}`);
          } else if (!props) {
            return <SpinnerPage />;
          } else {
            return <Component {...props} />;
          }
        }}
        query={graphql`
          query routes_Checkout_Query {
            me {
              ...Checkout_me
              ...UserData_me
            }
            cart {
              ...Checkout_cart
              ...UserDataTotalLocalFragment
            }
          }
        `}
      />

      <Route
        path="/buy-now"
        Component={BuyNow}
        render={({ props, Component, resolving }) => {
          if (Component && resolving === true && props && !props.me) {
            const {
              location: { pathname, search },
            } = props;
            JWT.clearJWT();
            throw new RedirectException(`/login?from=${pathname}${search}`);
          } else if (props && Component) {
            return <Component {...props} />;
          } else {
            return undefined;
          }
        }}
        query={graphql`
          query routes_BuyNow_Query(
            $productID: Int!
            $variantId: Int!
            $quantity: Int!
            $shippingId: Int
          ) {
            me {
              ...UserData_me
              id
              rawId
              phone
              email
              firstName
              lastName
              deliveryAddressesFull {
                id
                address {
                  country
                  countryCode
                  value
                  administrativeAreaLevel1
                  administrativeAreaLevel2
                  locality
                  political
                  postalCode
                  route
                  streetNumber
                  placeId
                }
                isPriority
              }
            }
            baseProduct(id: $productID) {
              ...BuyNow_baseProduct
            }
            calculateBuyNow(
              productId: $variantId
              quantity: $quantity
              shippingId: $shippingId
            ) {
              product {
                id
                rawId
              }
              couponsDiscounts
              totalCost
              totalCostWithoutDiscounts
              totalCount
              deliveryCost
              subtotal
              subtotalWithoutDiscounts
              price
            }
          }
        `}
        prepareVariables={(...args) => {
          const queryObj = pathOr('', ['query'], last(args).location);
          return {
            productID: parseFloat(queryObj.product || 0),
            variantId: parseFloat(queryObj.variant),
            quantity: parseFloat(queryObj.quantity),
            shippingId: parseFloat(queryObj.delivery),
          };
        }}
      />

      <Route
        path="/categories"
        Component={Categories}
        query={graphql`
          query routes_Categories_Query($searchTerm: SearchProductInput!) {
            search {
              ...Categories_search @arguments(text: $searchTerm)
            }
          }
        `}
        prepareVariables={(...args) => {
          const queryObj = pathOr('', ['query'], last(args).location);
          const searchTerm = urlToInput(queryObj);
          return {
            searchTerm: {
              name: searchTerm.name,
              options: pick(
                [
                  'attrFilters',
                  'priceFilter',
                  'currency',
                  'categoryId',
                  'storeId',
                  'sortBy',
                  'status',
                ],
                searchTerm.options || {},
              ),
            },
          };
        }}
      />
      <Route
        path="/stores"
        Component={Stores}
        query={graphql`
          query routes_Stores_Query($input: SearchStoreInput!) {
            search {
              ...Stores_search @arguments(text: $input)
            }
          }
        `}
        prepareVariables={(_, { location }) => {
          const queryObj = pathOr('', ['query'], location);
          const searchTerm = urlToInput(queryObj);
          return { input: { ...searchTerm, getStoresTotalCount: true } };
        }}
      />
      <Route path="/store">
        <Route
          path="/:storeId/products/:productId/:variant?/:variantId?"
          Component={ProductCard}
          query={graphql`
            query routes_ProductCard_Query($productID: Int!) {
              me {
                id
                rawId
                phone
                firstName
                lastName
                deliveryAddressesFull {
                  id
                  address {
                    country
                    countryCode
                    value
                    administrativeAreaLevel1
                    administrativeAreaLevel2
                    locality
                    political
                    postalCode
                    route
                    streetNumber
                    placeId
                  }
                  isPriority
                }
              }
              baseProduct(id: $productID, visibility: "active") {
                ...Product_baseProduct
              }
            }
          `}
          prepareVariables={(_, { params }) => ({
            productID: parseInt(params.productId || 0, 10),
          })}
        />
      </Route>

      <Redirect from="/start-selling" to={() => '/start-selling/en'} />
      <Route
        path="start-selling/:lang"
        query={graphql`
          query routes_StartSelling_Query {
            me {
              id
              wizardStore {
                id
                rawId
                completed
                storeId
              }
            }
          }
        `}
        Component={StartSelling}
        render={({ props, Component }) => {
          if (props) {
            const { me } = props;
            if (
              !isNil(me) &&
              !isNil(me.wizardStore) &&
              me.wizardStore.completed
            ) {
              throw new RedirectException(
                `/manage/store/${me.wizardStore.storeId}`,
              );
            } else {
              return <Component />;
            }
          } else {
            return null;
          }
        }}
      />

      <Route
        path="/manage"
        query={graphql`
          query routes_Manage_Query {
            me {
              id
              ...UserData_me
            }
            cart {
              ...UserDataTotalLocalFragment
            }
          }
        `}
        render={({ props, Component, resolving }) => {
          if (Component && props) {
            const {
              location: { pathname },
            } = props;

            if (pathname === '/manage' || pathname === '/manage/') {
              throw new RedirectException('/404');
            }

            if (!props.me && resolving === true) {
              JWT.clearJWT();
              throw new RedirectException(`/login?from=${pathname}`);
            }
          }
        }}
        Component={() => <div />}
      >
        <Route
          path="/wizard"
          query={graphql`
            query routes_Wizard_Query {
              languages {
                isoCode
              }
              me {
                id
                wizardStore {
                  id
                  completed
                  storeId
                }
                ...Wizard_me
                ...UserData_me
              }
              cart {
                ...UserDataTotalLocalFragment
              }
              allCategories {
                ...ThirdForm_allCategories
              }
            }
          `}
          Component={Wizard}
          render={({ props, Component }) => {
            if (props) {
              if (!props.me) {
                throw new RedirectException(`/login?from=/start-selling`);
              } else if (
                props.me.wizardStore &&
                props.me.wizardStore.completed
              ) {
                throw new RedirectException(
                  `/manage/store/${props.me.wizardStore.storeId}/products`,
                );
              } else {
                return <Component {...props} />;
              }
            } else {
              return null;
            }
          }}
        />
        <Route path="/store">
          <Route
            path="/new"
            exact
            query={graphql`
              query routes_NewStore_Query {
                me {
                  myStore {
                    id
                    rawId
                  }
                }
              }
            `}
            render={({ props, Component }) => {
              const myStoreId = pathOr(null, ['me', 'myStore', 'rawId'], props);
              if (myStoreId) {
                throw new RedirectException(
                  `/manage/store/${myStoreId}/products`,
                );
              } else {
                return <Component {...props} />;
              }
            }}
            Component={NewStore}
          />
          <Route
            path="/:storeId"
            query={graphql`
              query routes_CheckStore_Query {
                me {
                  myStore {
                    id
                    rawId
                    logo
                    name {
                      lang
                      text
                    }
                  }
                }
              }
            `}
            render={({ props, Component }) => {
              const myStoreId = pathOr(null, ['me', 'myStore', 'rawId'], props);
              const routeStoreId = pathOr(null, ['params', 'storeId'], props);
              if (!myStoreId || `${myStoreId}` !== `${routeStoreId}`) {
                return <Component />;
              }
              return undefined;
            }}
            Component={Error404}
          >
            <Route
              Component={EditStore}
              query={graphql`
                query routes_ManageStore_Query {
                  me {
                    id
                    ...EditStore_me
                  }
                }
              `}
            />
            <Route
              path="/contacts"
              Component={Contacts}
              query={graphql`
                query routes_Contacts_Query {
                  me {
                    ...Contacts_me
                  }
                }
              `}
            />
            <Route
              path="/finances"
              Component={Finances}
              query={graphql`
                query routes_Finances_Query {
                  me {
                    ...Finances_me
                  }
                }
              `}
            />
            <Route
              path="/orders"
              Component={StoreOrders}
              query={graphql`
                query routes_StoreOrders_Query {
                  me {
                    ...StoreOrders_me
                  }
                }
              `}
            />
            <Route
              path="/orders/:orderId"
              Component={StoreOrder}
              query={graphql`
                query routes_StoreOrder_Query($slug: Int!) {
                  me {
                    ...StoreOrder_me @arguments(slug: $slug)
                  }
                }
              `}
              prepareVariables={(_, { params }) => ({
                slug: parseInt(params.orderId, 10) || 0,
              })}
            />
            <Route
              path="/orders/:orderId/invoice"
              Component={OrderInvoice}
              prepareVariables={(_, { params }) => ({
                orderId: parseInt(params.orderId, 10) || 0,
              })}
              query={graphql`
                query routes_OrderInvoice_Query($orderId: Int!) {
                  me {
                    ...OrderInvoice_me @arguments(slug: $orderId)
                  }
                }
              `}
            />
            <Route
              path="/product/new"
              Component={({ me, allCategories }) => (
                <NewProduct me={me} allCategories={allCategories} />
              )}
              query={graphql`
                query routes_NewProduct_Query {
                  me {
                    ...NewProduct_me
                  }
                  allCategories {
                    ...Form_allCategories
                  }
                }
              `}
            />
            <Route
              path="/products"
              Component={Products}
              query={graphql`
                query routes_Products_Query {
                  me {
                    ...Products_me
                  }
                }
              `}
            />
            <Route
              path="/products/:productId/:tab?/:variantId?"
              Component={EditProduct}
              query={graphql`
                query routes_Product_Query($productID: Int!) {
                  me {
                    id
                    ...EditProduct_me @arguments(productId: $productID)
                  }
                  allCategories {
                    ...Form_allCategories
                  }
                }
              `}
              prepareVariables={(_, { params }) => ({
                productID: parseInt(params.productId, 10) || 0,
              })}
            />
            <Route
              path="/storages"
              Component={Storages}
              query={graphql`
                query routes_Storages_Query {
                  me {
                    ...Storages_me
                  }
                }
              `}
              prepareVariables={(_, { params }) => ({
                storeId: parseInt(params.storeId, 10) || 0,
              })}
            />
            <Route path="/storage/new" Component={NewStorage} />
            <Route
              path="/storages/:storageSlug"
              Component={StorageProducts}
              query={graphql`
                query routes_StorageProducts_Query($storageSlug: String!) {
                  me {
                    ...StorageProducts_me @arguments(storageSlug: $storageSlug)
                  }
                }
              `}
              prepareVariables={(_, { params }) => ({
                storageSlug: params.storageSlug,
              })}
            />
            <Route
              path="/storages/:storageSlug/edit"
              Component={EditStorage}
              query={graphql`
                query routes_EditStorage_Query($storageSlug: String!) {
                  me {
                    ...EditStorage_me @arguments(storageSlug: $storageSlug)
                  }
                }
              `}
              prepareVariables={(_, { params }) => ({
                storageSlug: params.storageSlug,
              })}
            />
          </Route>
        </Route>
      </Route>

      <Route
        path="/registration"
        Component={Authorization}
        render={({ Component, props, error }) => {
          if (error) {
            const errors = pathOr(null, ['source', 'errors'], error);
            if (find(pathEq(['data', 'details', 'code'], '401'))(errors)) {
              return <Component isSignUp {...props} />;
            }
          }
          return <Component isSignUp {...props} />;
        }}
      />

      <Route
        path="/login"
        query={graphql`
          query routes_Login_Query {
            me {
              id
            }
          }
        `}
        Component={Login}
        render={({ Component, props }) => {
          if (props && !isNil(props.me)) {
            throw new RedirectException(`/`);
            // $FlowIgnoreMe
            return; // eslint-disable-line
          }
          // eslint-disable-next-line
          return <Component noPopup {...props} />;
        }}
      />

      <Route path="/logout" Component={Logout} />

      <Route path="/password_reset/:token" Component={PasswordReset} />

      <Route
        path="/oauth_callback/fb"
        Component={OAuthCallback}
        render={({ props, Component }) => (
          <Component provider="FACEBOOK" {...props} />
        )}
      />

      <Route
        path="/oauth_callback/google"
        Component={OAuthCallback}
        render={({ props, Component }) => (
          <Component provider="GOOGLE" {...props} />
        )}
      />

      <Route path="/verify_email/:token" Component={VerifyEmail} />

      <Redirect from="/profile" to={() => '/profile/personal-data'} />
      <Route path="/profile">
        <Route
          path="/orders/:orderId/payment-info"
          Component={Invoice}
          render={({ props, Component }) => {
            if (!props) {
              return undefined;
            }
            return <Component {...props} />;
          }}
          query={graphql`
            query routes_Invoice_Query($slug: Int!) {
              me {
                ...Invoice_me @arguments(slug: $slug)
              }
            }
          `}
          prepareVariables={(_, { params }) => ({
            slug: parseInt(params.orderId, 10),
          })}
        />
        <Route
          path="/:item/:orderId?"
          Component={Profile}
          query={graphql`
            query routes_ProfileItem_Query($slug: Int!) {
              me {
                ...Profile_me @arguments(slug: $slug)
                ...UserData_me
              }
              cart {
                ...UserDataTotalLocalFragment
              }
            }
          `}
          render={({ props, Component }) => {
            if (props) {
              if (!props.me) {
                const {
                  location: { pathname },
                } = props;
                JWT.clearJWT();
                throw new RedirectException(`/login?from=${pathname}`);
              } else {
                const isOrder = pathOr(null, ['params', 'orderId'], props);
                const item = pathOr('personal-data', ['params', 'item'], props);
                return (
                  <Component
                    {...props}
                    activeItem={isOrder && item === 'orders' ? 'orders' : item}
                    isOrder={isOrder}
                  />
                );
              }
            } else {
              return undefined;
            }
          }}
          prepareVariables={(_, { params }) => ({
            slug: parseInt(params.orderId, 10) || 0,
          })}
        />
      </Route>
      <Route
        path="/store/:storeId"
        Component={Store}
        query={graphql`
          query routes_Store_Query($storeId: Int!) {
            store(id: $storeId, visibility: "active") {
              id
              rawId
              logo
              cover
              name {
                lang
                text
              }
              rating
              facebookUrl
              twitterUrl
              instagramUrl
              ...StoreItems_shop @arguments(storeId: $storeId)
              ...About_shop
              ...Showcase_shop
            }
          }
        `}
        render={({ props, Component }) => {
          if (props) {
            return <Component {...props} />;
          }
          return undefined;
        }}
        prepareVariables={(_, { params }) => ({
          storeId: parseInt(params.storeId, 10),
        })}
      >
        <Route
          Component={Showcase}
          render={({ props, Component }) => <Component {...props} key="shop" />}
        />
        <Route
          path="/about"
          Component={StoreAbout}
          render={({ props, Component }) => (
            <Component {...props} key="about" />
          )}
        />
        <Route
          path="/items"
          Component={StoreItems}
          render={({ props, Component }) => (
            <Component {...props} key="items" />
          )}
        />
      </Route>
    </Route>
  </Route>
);

export default routes;
