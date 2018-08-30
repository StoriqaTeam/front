// @flow

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { pathOr, isEmpty, map, addIndex } from 'ramda';
import { graphql, createRefetchContainer } from 'react-relay';

import { Paginator } from 'components/common/Paginator';
import { withShowAlert } from 'components/App/AlertContext';
import { Page } from 'components/App';
import { ManageStore } from 'pages/Manage/Store';
import { Autocomplete } from 'components/common/Autocomplete';
import { log, fromRelayError, getNameText } from 'utils';

import { SetProductQuantityInWarehouseMutation } from 'relay/mutations';
import type { MutationParamsType } from 'relay/mutations/SetProductQuantityInWarehouseMutation';
import type { AddAlertInputType } from 'components/App/AlertContext';
import type { StorageProducts_me as StorageProductsMeType } from './__generated__/StorageProducts_me.graphql';

import { StorageProductsTableHeader, StorageProductsTableRow } from './index';

import './StorageProducts.scss';

const itemsPerPage = 10;

type PropsType = {
  showAlert: (input: AddAlertInputType) => void,
  relay: {
    refetch: Function,
  },
  me: StorageProductsMeType,
};

type StateType = {
  currentPage: number,
  autocompleteValue: string,
  searchTermValue: string,
  autocompleteItems: Array<{ id: string, label: string }>,
};

class StorageProducts extends Component<PropsType, StateType> {
  state = {
    currentPage: 1,
    autocompleteValue: '',
    searchTermValue: '',
    autocompleteItems: [],
  };
  handleSave = (productId: number, quantity: number): void => {
    // $FlowIgnoreMe
    const warehouseId = pathOr(null, ['me', 'warehouse', 'id'], this.props);
    // const { storageFocusValue: quantity } = this.state;
    const { environment } = this.context;
    const params: MutationParamsType = {
      input: {
        clientMutationId: '',
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
            text: `Error: "${statusError}"`,
            link: { text: 'Close.' },
          });
          return;
        }
        if (errors) {
          this.props.showAlert({
            type: 'danger',
            text: 'Something going wrong :(',
            link: { text: 'Close.' },
          });
          // eslint-disable-next-line
          return;
        }
      },
      onError: (error: Error) => {
        log.debug({ error });
        this.props.showAlert({
          type: 'danger',
          text: 'Something going wrong :(',
          link: { text: 'Close.' },
        });
      },
    };
    SetProductQuantityInWarehouseMutation.commit(params);
  };

  loadPage = (pageNumber: number) => {
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
      () => {},
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
    const { autocompleteItems } = this.state;
    // $FlowIgnoreMe
    const storageName = pathOr('Unnamed', ['warehouse', 'name'], me);
    const products = map(item => {
      const productId = pathOr({}, ['node', 'productId'], item);
      const quantity = pathOr({}, ['node', 'quantity'], item);
      const product = pathOr({}, ['node', 'product'], item);
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
        {!isEmpty(products) ? (
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
          <div styleName="emptyProductsBlock">No products</div>
        )}
        <Paginator
          pagesCount={pagesCount}
          currentPage={currentPage}
          onPageSelect={this.loadPage}
        />
      </div>
    );
  }
}

StorageProducts.contextTypes = {
  environment: PropTypes.object.isRequired,
};

export default createRefetchContainer(
  withShowAlert(
    Page(ManageStore(StorageProducts, 'Storages', 'Storage products'), true),
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
