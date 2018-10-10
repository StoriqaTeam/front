// @flow

// just for reinit cd. can remove.

import React from 'react';
import { Route, RedirectException, Redirect } from 'found';
import { graphql } from 'react-relay';
import { find, pathEq, pathOr, last, isNil } from 'ramda';

import { log, removeCookie } from 'utils';
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
import { Wizard } from 'pages/Manage/Wizard';
import Stores from 'pages/Stores/Stores';
import { NewProduct, EditProduct } from 'pages/Manage/Store/Products/Product';
import { Product as ProductCard } from 'pages/Store/Product';
import Categories from 'pages/Search/Categories';
import Cart from 'pages/Cart';
import Checkout from 'pages/Checkout';
import { Error, Error404 } from 'pages/Errors';
import VerifyEmail from 'pages/VerifyEmail';
import { Logout } from 'pages/Logout';
import { StoreOrders, StoreOrder } from 'pages/Manage/Store/Orders';
import { Invoice } from 'pages/Profile/items/Order';
import { Store, StoreAbout, StoreItems, Showcase } from 'pages/Store';
import { StartSelling } from 'pages/StartSelling';
import { Login } from 'pages/Login';
import { PasswordReset } from 'pages/PasswordReset';

const routes = (
  <Route>
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
            ...Cart_cart
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
      />

      <Route
        path="/checkout"
        Component={Checkout}
        render={({ props, Component }) => {
          if (props && !props.me) {
            const {
              location: { pathname },
            } = props;
            removeCookie('__jwt');
            throw new RedirectException(`/login?from=${pathname}`);
          } else if (!props) {
            return null;
          } else {
            return <Component {...props} />;
          }
        }}
        query={graphql`
          query routes_Checkout_Query {
            me {
              ...Checkout_me
            }
            cart {
              ...Checkout_cart
            }
          }
        `}
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
          return { searchTerm };
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
          path="/:storeId/products/:productId"
          Component={ProductCard}
          query={graphql`
            query routes_ProductCard_Query($productID: Int!) {
              baseProduct(id: $productID) {
                ...Product_baseProduct
              }
            }
          `}
          prepareVariables={(_, { params }) => ({
            productID: parseInt(params.productId, 10),
          })}
        />
      </Route>

      <Route
        path="start-selling"
        query={graphql`
          query routes_StartSelling_Query {
            me {
              id
              wizardStore {
                id
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
            }
          }
        `}
        render={({ props }) => {
          if (props && !props.me) {
            const {
              location: { pathname },
            } = props;
            removeCookie('__jwt');
            throw new RedirectException(`/login?from=${pathname}`);
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
                    ...EditStore_me
                  }
                  ...InputSlug_storeSlugExists
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
                query routes_StoreOrder_Query {
                  me {
                    ...StoreOrder_me
                  }
                }
              `}
            />
            <Route path="/orders/:orderId/invoice" Component={OrderInvoice} />
            <Route
              path="/product/new"
              Component={({ me }) => <NewProduct me={me} />}
              query={graphql`
                query routes_NewProduct_Query {
                  me {
                    ...NewProduct_me
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
              path="/products/:productId"
              Component={EditProduct}
              query={graphql`
                query routes_Product_Query($productID: Int!) {
                  me {
                    id
                    ...EditProduct_me @arguments(productId: $productID)
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
          return <Component alone {...props} />;
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
            query routes_ProfileItem_Query {
              me {
                ...Profile_me
              }
            }
          `}
          render={({ props, Component }) => {
            if (props) {
              if (!props.me) {
                const {
                  location: { pathname },
                } = props;
                removeCookie('__jwt');
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
          prepareVariables={() => {}}
        />
      </Route>
      <Route
        path="/store/:storeId"
        Component={Store}
        query={graphql`
          query routes_Store_Query($storeId: Int!) {
            store(id: $storeId) {
              id
              rawId
              logo
              cover
              name {
                lang
                text
              }
              rating
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
