// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { pathOr, isEmpty, map, head, addIndex } from 'ramda';
import { withRouter, routerShape } from 'found';
import { graphql, createPaginationContainer, Relay } from 'react-relay';

import { Page } from 'components/App';
import { ManageStore } from 'pages/Manage/Store';
import { getNameText, log, fromRelayError } from 'utils';
import { withShowAlert } from 'components/Alerts/AlertContext';
import { Button } from 'components/common/Button';
import { Confirmation } from 'components/Confirmation';

import type { AddAlertInputType } from 'components/Alerts/AlertContext';

import { DeactivateBaseProductMutation } from 'relay/mutations';

import type { Products_me as ProductsMe } from './__generated__/Products_me.graphql';

import { ProductsHeader, ProductsTableHeader, ProductsTableRow } from './index';

import './Products.scss';

import t from './i18n';

type PropsType = {
  router: routerShape,
  showAlert: (input: AddAlertInputType) => void,
  relay: Relay,
  me: ProductsMe,
};

type StateType = {
  showModal: boolean,
  dataToDelete: ?string,
};

class Products extends PureComponent<PropsType, StateType> {
  state = {
    showModal: false,
    dataToDelete: null,
  };

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

  deleteProduct = (id: string): void => {
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
            text: `${t.error} "${statusError}"`,
            link: { text: t.close },
          });
          return;
        }

        // $FlowIgnoreMe
        const parsingError = pathOr(null, ['300', 'message'], relayErrors);
        if (parsingError) {
          log.debug('parsingError:', { parsingError });
          this.props.showAlert({
            type: 'danger',
            text: t.somethingGoingWrong,
            link: { text: t.close },
          });
          return;
        }
        this.handleCloseModal();
        this.props.showAlert({
          type: 'success',
          text: t.deleted,
          link: { text: '' },
        });
      },
      onError: (error: Error) => {
        log.error(error);
        this.props.showAlert({
          type: 'danger',
          text: t.somethingGoingWrong,
          link: { text: t.close },
        });
      },
    });
  };

  handleDelete = () => {
    const { dataToDelete } = this.state;
    // $FlowIgnoreMe
    this.deleteProduct(dataToDelete);
  };

  handleDeleteModal = (id: string, e): void => {
    e.stopPropagation();
    this.setState({ showModal: true, dataToDelete: id });
  };

  handleCloseModal = (): void => {
    this.setState({ showModal: false, dataToDelete: null });
  };

  productsRefetch = () => {
    this.props.relay.loadMore(8);
  };

  render() {
    const { me } = this.props;
    const { showModal } = this.state;
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
    const mapIndexed = addIndex(map);
    return (
      <div styleName="container">
        <ProductsHeader onAdd={this.addProduct} />
        <ProductsTableHeader />
        <Confirmation
          showModal={showModal}
          onClose={this.handleCloseModal}
          title={t.deleteYourProduct}
          description={t.confirmationDescription}
          onCancel={this.handleCloseModal}
          onConfirm={this.handleDelete}
          confirmText={t.confirmText}
          cancelText={t.cancelText}
        />
        {isEmpty(products) ? (
          <div styleName="emptyProductsBlock">{t.noProducts}</div>
        ) : (
          mapIndexed(
            /* eslint-disable no-return-assign */
            (item, index) => (
              /* eslint-disable no-plusplus, no-param-reassign, no-return-assign */
              <ProductsTableRow
                key={item.rawId}
                item={item}
                onEdit={this.editProduct}
                onDelete={this.handleDeleteModal}
                onCheckbox={this.handleCheckboxClick}
                index={(index += 1)}
              />
            ),
            products,
          )
        )}
        {this.props.relay.hasMore() && (
          <div styleName="loadButton">
            <Button
              big
              load
              onClick={this.productsRefetch}
              dataTest="storeProductsLoadMoreButton"
              wireframe
            >
              {t.loadMore}
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
  withShowAlert(
    withRouter(
      Page(
        ManageStore({
          OriginalComponent: Products,
          active: 'goods',
          title: 'Goods',
        }),
      ),
    ),
  ),
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
              currency
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
