// @flow

import React from 'react';
import { Route, RedirectException, Redirect } from 'found';
import { graphql } from 'react-relay';
import Cookies from 'universal-cookie';
import { find, pathEq, pathOr, last } from 'ramda';

import { log } from 'utils';
import { urlToInput } from 'utils/search';
import { App } from 'components/App';
import { Authorization, OAuthCallback } from 'components/Authorization';
import { Profile } from 'pages/Profile';
import Start from 'pages/Start/Start';
import { NewStore, EditStore } from 'pages/Manage/Store/Settings';
import { Products } from 'pages/Manage/Store/Products';
import { Storages } from 'pages/Manage/Store/Storages';
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
import Logout from 'pages/Logout';
import { StoreOrders, StoreOrder } from 'pages/Manage/Store/Orders';

const routes = (
  <Route>
    <Route path="/error" Component={Error} />
    <Route
      path="/"
      Component={App}
      query={graphql`
        query routes_App_Query {
          id
          me {
            id
            ...App_me
          }
          cart {
            id
            totalCount
            ...Cart_cart
          }
          mainPage {
            ...Start_mainPage
          }
          languages {
            isoCode
          }
          currencies {
            key
            name
          }
          categories {
            name {
              lang
              text
            }
            children {
              rawId
              parentId
              level
              name {
                lang
                text
              }
              children {
                rawId
                parentId
                level
                name {
                  lang
                  text
                }
                children {
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
      <Route Component={Start} />

      <Route
        path="/cart"
        render={({ props, Component }) => <Component {...props} />}
        Component={Cart}
      />

      <Route
        path="/checkout"
        Component={Checkout}
        render={({ props, Component }) => {
          if (props && !props.me) {
            const cookies = new Cookies();
            cookies.remove('__jwt');
            throw new RedirectException(`/login?from=/checkout`);
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
        prepareVariables={(...args) => {
          const queryObj = pathOr('', ['query'], last(args).location);
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
      {/* TODO: вынести в HOC ли придумать что-то */}
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
            const cookies = new Cookies();
            cookies.remove('__jwt');
            throw new RedirectException(`/login?from=${pathname}`);
          }
        }}
        Component={() => <div />}
      >
        <Route
          path="/wizard"
          Component={Wizard}
          query={graphql`
            query routes_Wizard_Query {
              languages {
                isoCode
              }
              me {
                ...Wizard_me
              }
            }
          `}
        />
        <Route path="/store">
          <Route
            path="/new"
            exact
            query={graphql`
              query routes_NewStore_Query {
                me {
                  myStore {
                    rawId
                  }
                }
              }
            `}
            render={({ props, Component }) => {
              const myStoreId = pathOr(null, ['me', 'myStore', 'rawId'], props);
              if (myStoreId) {
                throw new RedirectException(`/manage/store/${myStoreId}`);
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
                    rawId
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
                query routes_Store_Query {
                  me {
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
            <Route
              path="/storage/new"
              Component={NewStorage}
              query={graphql`
                query routes_NewStorage_Query($storeId: Int!) {
                  me {
                    ...NewStorage_me @arguments(storeId: $storeId)
                  }
                }
              `}
              prepareVariables={(_, { params }) => ({
                storeId: parseInt(params.storeId, 10) || 0,
              })}
            />
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
          return <Component isSignUp alone {...props} />;
        }}
      />
      <Route
        path="/login"
        Component={Authorization}
        render={({ Component, props }) => <Component alone {...props} />}
      />
      <Route path="/logout" Component={Logout} />
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
              if (props && !props.me) {
                const {
                  location: { pathname },
                } = props;
                const cookies = new Cookies();
                cookies.remove('__jwt');
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
              return null;
            }
          }}
          prepareVariables={() => {}}
        />
      </Route>
    </Route>
  </Route>
);

export default routes;
