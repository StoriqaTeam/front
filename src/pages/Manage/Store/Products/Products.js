// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { pathOr, isEmpty, map, head } from 'ramda';
import { withRouter, routerShape } from 'found';
import { graphql, createPaginationContainer, Relay } from 'react-relay';

import { Page } from 'components/App';
import { ManageStore } from 'pages/Manage/Store';
import {
  getNameText,
  formatPrice,
  log,
  fromRelayError,
  convertSrc,
} from 'utils';
import { withShowAlert } from 'components/App/AlertContext';
import { Button } from 'components/common/Button';
import { Checkbox } from 'components/common/Checkbox';
import { Icon } from 'components/Icon';

import type { AddAlertInputType } from 'components/App/AlertContext';
import BannerLoading from 'components/Banner/BannerLoading';
import ImageLoader from 'libs/react-image-loader';

import { DeactivateBaseProductMutation } from 'relay/mutations';

import type { Products_me as ProductsMe } from './__generated__/Products_me.graphql';

import './Products.scss';

type PropsType = {
  router: routerShape,
  showAlert: (input: AddAlertInputType) => void,
  relay: Relay,
  me: ProductsMe,
};

class Products extends PureComponent<PropsType> {
  addProduct = () => {
    // $FlowIgnoreMe
    const storeId = pathOr(null, ['match', 'params', 'storeId'], this.props);

    if (storeId) {
      this.props.router.push(`/manage/store/${storeId}/product/new`);
    }
  };

  editProduct = (id: number) => {
    // $FlowIgnoreMe
    const storeId = pathOr(null, ['match', 'params', 'storeId'], this.props);

    if (storeId) {
      this.props.router.push(
        `/manage/store/${storeId}/products/${parseInt(id, 10)}`,
      );
    }
  };

  handleCheckboxClick = (id: string | number) => {
    log.info('id', id);
  };

  handleDelete = (id: string, e) => {
    e.stopPropagation();
    // $FlowIgnoreMe
    const storeId = pathOr(null, ['me', 'myStore', 'id'], this.props);

    DeactivateBaseProductMutation.commit({
      id,
      parentID: storeId,
      environment: this.context.environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        log.debug({ response, errors });

        const relayErrors = fromRelayError({ source: { errors } });
        log.debug({ relayErrors });

        // $FlowIgnoreMe
        const statusError: string = pathOr({}, ['100', 'status'], relayErrors);
        if (!isEmpty(statusError)) {
          this.props.showAlert({
            type: 'danger',
            text: `Error: "${statusError}"`,
            link: { text: 'Close.' },
          });
          return;
        }

        // $FlowIgnoreMe
        const parsingError = pathOr(null, ['300', 'message'], relayErrors);
        if (parsingError) {
          log.debug('parsingError:', { parsingError });
          this.props.showAlert({
            type: 'danger',
            text: 'Something going wrong :(',
            link: { text: 'Close.' },
          });
          return;
        }
        this.props.showAlert({
          type: 'success',
          text: 'Deleted!',
          link: { text: '' },
        });
      },
      onError: (error: Error) => {
        log.error(error);
        this.props.showAlert({
          type: 'danger',
          text: 'Something going wrong.',
          link: { text: 'Close.' },
        });
      },
    });
  };

  productsRefetch = () => {
    this.props.relay.loadMore(8);
  };

  renderHeaderRow = () => (
    <div styleName="headerRowWrap">
      <div styleName="td tdCheckbox">
        <Checkbox id="header" onChange={() => {}} />
      </div>
      <div styleName="td tdFoto" />
      <div styleName="td tdName">
        <div>
          <span>Name</span>
          <Icon inline type="sortArrows" />
        </div>
      </div>
      <div styleName="td tdCategory">
        <div>
          <span>Category</span>
          <Icon inline type="sortArrows" />
        </div>
      </div>
      <div styleName="td tdPrice">
        <div>
          <span>Price</span>
          <Icon inline type="sortArrows" />
        </div>
      </div>
      <div styleName="td tdCashback">
        <div>
          <span>Cashback</span>
          <Icon inline type="sortArrows" />
        </div>
      </div>
      <div styleName="td tdCharacteristics">
        <span>Characteristics</span>
        <Icon inline type="sortArrows" />
      </div>
      <div styleName="td tdDelete">
        <button styleName="deleteButton">
          <Icon type="basket" size="32" />
        </button>
      </div>
    </div>
  );

  renderRows = (item: {
    id: string,
    rawId: number,
    categoryName: string,
    currencyId: number,
    name: string,
    product: {
      cashback: ?number,
      photoMain: ?string,
      price: ?number,
    },
  }) => {
    const { product } = item;
    // $FlowIgnoreMe
    const attributes = pathOr([], ['product', 'attributes'], item);
    return (
      <div
        key={item.rawId}
        styleName="itemRowWrap"
        onClick={() => {
          this.editProduct(item.rawId);
        }}
        onKeyDown={() => {}}
        role="button"
        tabIndex="0"
        data-test="editProductButton"
      >
        <div styleName="td tdCheckbox">
          <Checkbox id={item.rawId} onChange={this.handleCheckboxClick} />
        </div>
        <div styleName="td tdFoto">
          <div styleName="foto">
            {!product || !product.photoMain ? (
              <Icon type="camera" size="40" />
            ) : (
              <ImageLoader
                fit
                src={convertSrc(product.photoMain, 'small')}
                loader={<BannerLoading />}
              />
            )}
          </div>
        </div>
        <div styleName="td tdName">
          <div>
            <span>{item.name}</span>
          </div>
        </div>
        <div styleName="td tdCategory">
          <div>
            <span>{item.categoryName}</span>
          </div>
        </div>
        <div styleName="td tdPrice">
          <div>
            {product &&
              product.price && (
                <span>{`${formatPrice(product.price)} STQ`}</span>
              )}
          </div>
        </div>
        <div styleName="td tdCashback">
          <div>
            {product &&
              product.cashback && (
                <span>{`${(product.cashback * 100).toFixed(0)}%`}</span>
              )}
          </div>
        </div>
        <div styleName="td tdCharacteristics">
          {!isEmpty(attributes) && (
            <div>
              <div styleName="characteristicItem">
                <div styleName="characteristicLabels">
                  {map(attributeItem => {
                    const attributeName = getNameText(
                      attributeItem.attribute.name,
                      'EN',
                    );
                    return (
                      <div key={`attr-${attributeName}`}>
                        {`${attributeName}: `}
                      </div>
                    );
                  }, attributes)}
                </div>
                <div styleName="characteristicValues">
                  {map(attributeItem => {
                    const attributeName = getNameText(
                      attributeItem.attribute.name,
                      'EN',
                    );
                    const val = attributeItem.value;
                    return <div key={`attr-${attributeName}`}>{`${val}`}</div>;
                  }, attributes)}
                </div>
              </div>
            </div>
          )}
        </div>
        <div styleName="td tdDelete">
          <button
            styleName="deleteButton"
            onClick={(e: any) => {
              this.handleDelete(item.id, e);
            }}
            data-test="deleteProductButton"
          >
            <Icon type="basket" size="32" />
          </button>
        </div>
      </div>
    );
  };

  render() {
    const { me } = this.props;
    // $FlowIgnoreMe
    const baseProducts = pathOr([], ['myStore', 'baseProducts', 'edges'], me);
    const products = map(item => {
      const { node } = item;
      const newItem = {
        ...item.node,
        categoryName: getNameText(
          pathOr(null, ['category', 'name'], node),
          'EN',
        ),
        name: getNameText(pathOr(null, ['name'], node), 'EN'),
        product: head(pathOr([], ['products', 'edges'], node))
          ? head(node.products.edges).node
          : null,
      };
      return newItem;
    }, baseProducts);
    return (
      <div styleName="container">
        <div styleName="addButton">
          <Button
            wireframe
            big
            onClick={this.addProduct}
            dataTest="addProductButton"
          >
            Add item
          </Button>
        </div>
        <div styleName="subtitle">
          <strong>Goods list</strong>
        </div>
        <div>
          <div>{this.renderHeaderRow()}</div>
          <div>{map(item => this.renderRows(item), products)}</div>
        </div>
        {this.props.relay.hasMore() && (
          <div styleName="loadButton">
            <Button
              big
              load
              onClick={this.productsRefetch}
              dataTest="storeProductsLoadMoreButton"
            >
              Load more
            </Button>
          </div>
        )}
      </div>
    );
  }
}

Products.contextTypes = {
  environment: PropTypes.object.isRequired,
  showAlert: PropTypes.func,
};

export default createPaginationContainer(
  withShowAlert(withRouter(Page(ManageStore(Products, 'Goods'), true))),
  graphql`
    fragment Products_me on User
      @argumentDefinitions(
        first: { type: "Int", defaultValue: 8 }
        after: { type: "ID", defaultValue: null }
      ) {
      myStore {
        id
        logo
        name {
          text
          lang
        }
        baseProducts(first: $first, after: $after)
          @connection(key: "Wizard_baseProducts") {
          edges {
            node {
              id
              rawId
              name {
                text
                lang
              }
              shortDescription {
                lang
                text
              }
              category {
                id
                rawId
                name {
                  lang
                  text
                }
              }
              storeId
              currencyId
              products(first: 1) {
                edges {
                  node {
                    id
                    rawId
                    price
                    discount
                    photoMain
                    additionalPhotos
                    vendorCode
                    cashback
                    price
                    attributes {
                      value
                      metaField
                      attribute {
                        id
                        rawId
                        name {
                          lang
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
            }
          }
          pageInfo {
            endCursor
          }
        }
      }
    }
  `,
  {
    direction: 'forward',
    getConnectionFromProps: props =>
      props.me &&
      props.me.myStore &&
      props.me.myStore.baseProducts &&
      props.me.myStore.baseProducts,
    getVariables: props => ({
      first: 8,
      after: props.me.myStore.baseProducts.pageInfo.endCursor,
    }),
    query: graphql`
      query Products_Query($first: Int, $after: ID) {
        me {
          ...Products_me @arguments(first: $first, after: $after)
        }
      }
    `,
  },
);

Products.contextTypes = {
  environment: PropTypes.object.isRequired,
};
