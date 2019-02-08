// @flow

import React, { Component, Fragment } from 'react';
import { pathOr, isEmpty, map, addIndex, filter } from 'ramda';
import { graphql, createRefetchContainer } from 'react-relay';
import type { Environment } from 'relay-runtime';
import uuidv4 from 'uuid/v4';

import { Paginator } from 'components/common/Paginator';
import { withShowAlert } from 'components/Alerts/AlertContext';
import { Page } from 'components/App';
import { ManageStore } from 'pages/Manage/Store';
import { Autocomplete } from 'components/common/Autocomplete';
import { log, fromRelayError, getNameText } from 'utils';

import { SetProductQuantityInWarehouseMutation } from 'relay/mutations';
import type { MutationParamsType } from 'relay/mutations/SetProductQuantityInWarehouseMutation';
import type { AddAlertInputType } from 'components/Alerts/AlertContext';
import type { StorageProducts_me as StorageProductsMeType } from './__generated__/StorageProducts_me.graphql';

import { StorageProductsTableHeader, StorageProductsTableRow } from '../index';

import './StorageProducts.scss';

import t from './i18n';

const itemsPerPage = 10;

type PropsType = {
  showAlert: (input: AddAlertInputType) => void,
  relay: {
    refetch: Function,
  },
  me: StorageProductsMeType,
  environment: Environment,
};

type StateType = {
  currentPage: number,
  autocompleteValue: string,
  searchTermValue: string,
  autocompleteItems: Array<{ id: string, label: string }>,
  isLoadingPagination: boolean,
};

class StorageProducts extends Component<PropsType, StateType> {
  state = {
    currentPage: 1,
    autocompleteValue: '',
    searchTermValue: '',
    autocompleteItems: [],
    isLoadingPagination: false,
  };
  handleSave = (productId: number, quantity: number): void => {
    // $FlowIgnoreMe
    const warehouseId = pathOr(null, ['me', 'warehouse', 'id'], this.props);
    // const { storageFocusValue: quantity } = this.state;
    const { environment } = this.props;
    const params: MutationParamsType = {
      input: {
        clientMutationId: uuidv4(),
        warehouseId,
        productId,
        quantity: parseInt(quantity, 10),
      },
      environment,
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
        if (errors) {
          this.props.showAlert({
            type: 'danger',
            text: t.somethingGoingWrong,
            link: { text: t.close },
          });
          // eslint-disable-next-line
          return;
        }
      },
      onError: (error: Error) => {
        log.debug({ error });
        this.props.showAlert({
          type: 'danger',
          text: t.somethingGoingWrong,
          link: { text: t.close },
        });
      },
    };
    SetProductQuantityInWarehouseMutation.commit(params);
  };

  loadPage = (pageNumber: number) => {
    this.setState({ isLoadingPagination: true });
    // $FlowIgnoreMe
    const storageSlug = pathOr(
      {},
      ['match', 'params', 'storageSlug'],
      this.props,
    );
    const { searchTermValue } = this.state;
    this.props.relay.refetch(
      {
        currentPage: pageNumber,
        itemsCount: itemsPerPage,
        storageSlug,
        searchTerm: {
          name: searchTermValue,
        },
        autocompleteValue: this.state.autocompleteValue,
      },
      null,
      () => {
        this.setState({ isLoadingPagination: false });
      },
      { force: true },
    );
  };

  handleOnChangeAutocomplete = (value: string) => {
    // $FlowIgnoreMe
    const storageSlug = pathOr(
      {},
      ['match', 'params', 'storageSlug'],
      this.props,
    );
    this.setState({
      autocompleteValue: value,
      searchTermValue: value,
    });
    this.props.relay.refetch(
      {
        autocompleteValue: value,
        currentPage: this.state.currentPage,
        itemsCount: itemsPerPage,
        storageSlug,
        searchTerm: {
          name: value,
        },
      },
      null,
      () => {
        const { me } = this.props;
        // $FlowIgnoreMe
        const items = pathOr(
          [],
          ['warehouse', 'autoCompleteProductName', 'edges'],
          me,
        );
        this.setState({
          autocompleteItems: addIndex(map)(
            (item, idx) => ({ id: `${idx}`, label: item.node }),
            items,
          ),
        });
      },
      { force: true },
    );
  };

  handleOnSetAutocomplete = (value: string) => {
    // $FlowIgnoreMe
    const storageSlug = pathOr(
      {},
      ['match', 'params', 'storageSlug'],
      this.props,
    );
    this.setState({
      autocompleteValue: value,
      searchTermValue: value,
    });
    this.props.relay.refetch(
      {
        autocompleteValue: value,
        currentPage: this.state.currentPage,
        itemsCount: itemsPerPage,
        storageSlug,
        searchTerm: {
          name: value,
        },
      },
      null,
      () => {},
      { force: true },
    );
  };

  render() {
    const { me } = this.props;
    const { autocompleteItems, isLoadingPagination } = this.state;
    // $FlowIgnoreMe
    const storageName = pathOr('Unnamed', ['warehouse', 'name'], me);
    const products = map(item => {
      const productId = pathOr({}, ['node', 'productId'], item);
      const quantity = pathOr({}, ['node', 'quantity'], item);
      const product = pathOr(null, ['node', 'product'], item);
      if (!product) {
        return {};
      }
      const currency = pathOr('', ['currency'], product);

      const { photoMain, price } = product;
      const name = getNameText(
        pathOr(null, ['baseProduct', 'name'], product),
        'EN',
      );
      const categoryName = getNameText(
        pathOr(null, ['baseProduct', 'category', 'name'], product),
        'EN',
      );
      const attributes = map(
        attribute => ({
          attrId: attribute.attrId,
          attributeName: getNameText(
            pathOr(null, ['attribute', 'name'], attribute),
            'EN',
          ),
          value: attribute.value,
        }),
        product.attributes,
      );
      return {
        id: product.id,
        productId,
        quantity,
        photoMain,
        name,
        categoryName,
        price,
        attributes,
        currency,
      };
      // $FlowIgnoreMe
    }, pathOr([], ['warehouse', 'products', 'edges'], me));
    // $FlowIgnoreMe
    const pagesCount = pathOr(
      0,
      ['warehouse', 'products', 'pageInfo', 'totalPages'],
      me,
    );
    // $FlowIgnoreMe
    const currentPage = pathOr(
      //
      0,
      ['warehouse', 'products', 'pageInfo', 'currentPage'],
      me,
    );
    const filteredProducts = filter(item => !isEmpty(item), products);
    return (
      <div styleName="container">
        <div styleName="searchInput">
          <Autocomplete
            autocompleteItems={autocompleteItems}
            onChange={this.handleOnChangeAutocomplete}
            onSet={this.handleOnSetAutocomplete}
            label="Search item"
            search
            fullWidth
          />
        </div>
        <div styleName="subtitle">
          <strong>{storageName}</strong>
        </div>
        <StorageProductsTableHeader />
        {!isEmpty(filteredProducts) ? (
          <Fragment>
            {map(
              item => (
                <StorageProductsTableRow
                  key={item.productId}
                  onSave={this.handleSave}
                  item={item}
                />
              ),
              products,
            )}
          </Fragment>
        ) : (
          <div styleName="emptyProductsBlock">{t.noProducts}</div>
        )}
        <Paginator
          pagesCount={pagesCount}
          currentPage={currentPage}
          onPageSelect={this.loadPage}
          isLoading={isLoadingPagination}
        />
      </div>
    );
  }
}

export default createRefetchContainer(
  withShowAlert(
    Page(
      ManageStore({
        OriginalComponent: StorageProducts,
        active: 'storages',
        title: 'Storages',
      }),
    ),
  ),
  graphql`
    fragment StorageProducts_me on User
      @argumentDefinitions(
        autocompleteValue: { type: "String!", defaultValue: "" }
        searchTerm: { type: "SearchProductInput" }
        storageSlug: { type: "String!", defaultValue: "" }
        currentPage: { type: "Int!", defaultValue: 1 }
        itemsCount: { type: "Int!", defaultValue: 10 }
      ) {
      warehouse(slug: $storageSlug) {
        id
        name
        autoCompleteProductName(first: 8, name: $autocompleteValue) {
          edges {
            node
          }
        }
        products(
          searchTerm: $searchTerm
          currentPage: $currentPage
          itemsCount: $itemsCount
          visibility: "active"
        ) {
          edges {
            node {
              productId
              product {
                baseProduct {
                  name {
                    lang
                    text
                  }
                  category {
                    name {
                      lang
                      text
                    }
                  }
                }
                id
                rawId
                price
                photoMain
                currency
                attributes {
                  attrId
                  attribute {
                    id
                    rawId
                    name {
                      lang
                      text
                    }
                  }
                  value
                }
              }
              quantity
            }
          }
          pageInfo {
            totalPages
            currentPage
            pageItemsCount
          }
        }
      }
    }
  `,
  graphql`
    query StorageProducts_Query(
      $autocompleteValue: String!
      $searchTerm: SearchProductInput
      $currentPage: Int!
      $itemsCount: Int!
      $storageSlug: String!
    ) {
      me {
        ...StorageProducts_me
          @arguments(
            autocompleteValue: $autocompleteValue
            searchTerm: $searchTerm
            currentPage: $currentPage
            itemsCount: $itemsCount
            storageSlug: $storageSlug
          )
      }
    }
  `,
);
