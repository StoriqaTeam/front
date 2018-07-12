// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { pathOr, isEmpty, map } from 'ramda';
import { graphql, createRefetchContainer } from 'react-relay';

import { Paginator } from 'components/common/Paginator';
import { withShowAlert } from 'components/App/AlertContext';
import { Page } from 'components/App';
import { ManageStore } from 'pages/Manage/Store';
import { Button } from 'components/common/Button';
import { Input } from 'components/common/Input';
import { Autocomplete } from 'components/common/Autocomplete';
import { Checkbox } from 'components/common/Checkbox';
import { Icon } from 'components/Icon';
import BannerLoading from 'components/Banner/BannerLoading';
import {
  log,
  fromRelayError,
  getNameText,
  convertSrc,
  formatPrice,
} from 'utils';
import ImageLoader from 'libs/react-image-loader';

import { SetProductQuantityInWarehouseMutation } from 'relay/mutations';
import type { MutationParamsType } from 'relay/mutations/SetProductQuantityInWarehouseMutation';
import type { AddAlertInputType } from 'components/App/AlertContext';
import type { StorageProducts_me as StorageProductsMeType } from './__generated__/StorageProducts_me.graphql';

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
  storageFocusId: ?number,
  storageFocusCurrentValue: ?string,
  storageFocusValue: ?string,
  currentPage: number,
  autocompleteValue: string,
  searchTermValue: string,
  autocompleteItems: Array<string>,
};

class StorageProducts extends Component<PropsType, StateType> {
  state = {
    storageFocusId: null,
    storageFocusCurrentValue: null,
    storageFocusValue: null,
    currentPage: 1,
    autocompleteValue: '',
    searchTermValue: '',
    autocompleteItems: [],
  };

  handleFocus = (e: any, quantity: number) => {
    const { id, value } = e.target;
    this.setState({
      storageFocusId: id,
      storageFocusCurrentValue: `${quantity}`,
      storageFocusValue: value,
    });
  };

  handleBlur = () => {
    const { storageFocusCurrentValue, storageFocusValue } = this.state;
    if (storageFocusValue === storageFocusCurrentValue) {
      this.setState({
        storageFocusId: null,
      });
    }
  };

  handleChange = (e: any) => {
    const { value } = e.target;

    if (value >= 0 && value !== '') {
      this.setState({
        storageFocusValue: value.replace(/^0+/, ''),
      });
    }
    if (value === '' || /^0+$/.test(value)) {
      this.setState({
        storageFocusValue: '0',
      });
    }
  };

  handleSave = (productId: number) => {
    // $FlowIgnoreMe
    const warehouseId = pathOr(null, ['me', 'warehouse', 'id'], this.props);
    const { storageFocusValue: quantity } = this.state;
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
          return;
        }
        this.setState({
          storageFocusId: null,
        });
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
        const filteredItems = map(item => item.node, items);
        this.setState({
          autocompleteItems: filteredItems,
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
      <div styleName="td tdCharacteristics">
        <span>Characteristics</span>
        <Icon inline type="sortArrows" />
      </div>
      <div styleName="td tdQuantity">
        <span>Quantity</span>
        <Icon inline type="sortArrows" />
      </div>
      <div styleName="td tdMove">
        <button styleName="moveButton">
          <Icon type="move" size="24" />
        </button>
      </div>
    </div>
  );

  renderRows = (item: {
    id: string,
    productId: number,
    quantity: number,
    photoMain: ?string,
    name: string,
    categoryName: string,
    price: string,
    attributes: Array<{
      attrId: number,
      attributeName: string,
      value: string,
    }>,
  }) => {
    const {
      productId,
      quantity,
      photoMain,
      name,
      categoryName,
      price,
      attributes,
    } = item;
    const { storageFocusId, storageFocusValue } = this.state;
    const thisProduct = `${productId}` === storageFocusId;
    return (
      <div key={productId} styleName="itemRowWrap">
        <div styleName="td tdCheckbox">
          <Checkbox id={`product-${productId}`} onChange={() => {}} />
        </div>
        <div styleName="td tdFoto">
          <div styleName="foto">
            {!photoMain ? (
              <Icon type="camera" size="40" />
            ) : (
              <ImageLoader
                fit
                src={convertSrc(photoMain, 'small')}
                loader={<BannerLoading />}
              />
            )}
          </div>
        </div>
        <div styleName="td tdName">
          <div>
            <span>{name}</span>
          </div>
        </div>
        <div styleName="td tdCategory">
          <div>
            <span>{categoryName}</span>
          </div>
        </div>
        <div styleName="td tdPrice">
          <div>{price && <span>{`${formatPrice(price)} STQ`}</span>}</div>
        </div>
        <div styleName="td tdCharacteristics">
          {!isEmpty(attributes) && (
            <div>
              <div styleName="characteristicItem">
                <div styleName="characteristicLabels">
                  {map(
                    attributeItem => (
                      <div key={attributeItem.attrId}>
                        {`${attributeItem.attributeName}: `}
                      </div>
                    ),
                    attributes,
                  )}
                </div>
                <div styleName="characteristicValues">
                  {map(
                    attributeItem => (
                      <div key={attributeItem.attrId}>
                        {attributeItem.value}
                      </div>
                    ),
                    attributes,
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <div styleName="td tdQuantity">
          <div styleName="quantityInput">
            <Input
              id={productId}
              type="number"
              inline
              fullWidth
              value={thisProduct ? storageFocusValue : `${quantity}`}
              onFocus={(e: any) => {
                this.handleFocus(e, quantity);
              }}
              onBlur={this.handleBlur}
              onChange={this.handleChange}
            />
          </div>
          {thisProduct && (
            <div>
              <Button
                small
                disabled={thisProduct && storageFocusValue === `${quantity}`}
                onClick={() => {
                  this.handleSave(productId);
                }}
                dataTest="saveQuantityButton"
              >
                Save
              </Button>
            </div>
          )}
        </div>
        <div styleName="td tdMove">
          <button styleName="moveButton" onClick={() => {}}>
            <Icon type="move" size="24" />
          </button>
        </div>
      </div>
    );
  };

  render() {
    const { me } = this.props;
    const { autocompleteItems, autocompleteValue } = this.state;
    // $FlowIgnoreMe
    const storageName = pathOr({}, ['warehouse', 'name'], me);
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
            autocompleteValue={autocompleteValue}
            onChange={this.handleOnChangeAutocomplete}
            onSet={this.handleOnSetAutocomplete}
            label="Search item"
            search
            fullWidth
          />
        </div>
        <div styleName="addButton">
          <Button wireframe big onClick={() => {}}>
            Add item
          </Button>
        </div>
        <div styleName="subtitle">
          <strong>{storageName}</strong>
        </div>
        <div>
          <div>{this.renderHeaderRow()}</div>
          {!isEmpty(products) && (
            <div>{map(item => this.renderRows(item), products)}</div>
          )}
        </div>
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
    Page(ManageStore(StorageProducts, 'Storages', 'Storage products')),
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
      myStore {
        logo
        name {
          lang
          text
        }
      }
      warehouse(slug: $storageSlug) {
        id
        name
        autoCompleteProductName(name: $autocompleteValue) {
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
                currencyId
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
