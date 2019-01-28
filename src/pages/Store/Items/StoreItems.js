// @flow

import React, { Component } from 'react';
import { withRouter } from 'found';
import { createPaginationContainer, graphql, Relay } from 'react-relay';
import { pathOr, map, addIndex, isEmpty } from 'ramda';

import { CardProduct } from 'components/CardProduct';
import { Button } from 'components/common/Button';
import { Autocomplete } from 'components/common/Autocomplete';
import { SearchNoResults } from 'components/SearchNoResults';

import { Col, Row } from 'layout';

import './StoreItems.scss';

import t from './i18n';

const productsPerRequest = 8;

type PropsType = {
  relay: Relay,
};

type StateType = {
  autocompleteValue: string,
  autocompleteItems: Array<{ id: string, label: string }>,
};

// eslint-disable-next-line
class StoreItems extends Component<PropsType, StateType> {
  state = {
    autocompleteValue: '',
    autocompleteItems: [],
  };

  productsRefetch = () => {
    const { autocompleteValue } = this.state;
    this.props.relay.refetchConnection(productsPerRequest, () => {}, {
      autocompleteValue,
      searchTerm: { name: autocompleteValue },
    });
  };

  handleOnChangeAutocomplete = (value: string) => {
    this.setState({ autocompleteValue: value }, () => {
      this.props.relay.refetchConnection(
        productsPerRequest,
        () => {
          const items = pathOr(
            [],
            ['shop', 'autoCompleteProductName', 'edges'],
            this.props,
          );
          this.setState({
            autocompleteItems: addIndex(map)(
              (item, idx) => ({ id: `${idx}`, label: item.node }),
              items,
            ),
          });
        },
        { autocompleteValue: value, searchTerm: { name: value }, after: null },
      );
    });
  };

  handleOnSetAutocomplete = (value: string) => {
    this.setState({ autocompleteValue: value }, () => {
      this.props.relay.refetchConnection(productsPerRequest, () => {}, {
        autocompleteValue: value,
        searchTerm: { name: value },
        after: null,
      });
    });
  };

  render() {
    const { autocompleteItems, autocompleteValue } = this.state;
    const products = map(
      item => item.node,
      pathOr([], ['shop', 'findProduct', 'edges'], this.props),
    );
    return (
      <div styleName="container">
        <div styleName="searchInput">
          <Autocomplete
            autocompleteItems={autocompleteItems}
            onChange={this.handleOnChangeAutocomplete}
            onSet={this.handleOnSetAutocomplete}
            label={t.labelSearchShopsProducts}
            search
            fullWidth
          />
        </div>
        <Row>
          {products && !isEmpty(products) ? (
            map(
              item => (
                <Col key={item.rawId} size={12} sm={6} md={4} xl={3}>
                  <div key={item.id} styleName="cardWrapper">
                    <CardProduct item={{ ...item }} />
                  </div>
                </Col>
              ),
              products,
            )
          ) : (
            <SearchNoResults value={autocompleteValue} />
          )}
        </Row>
        {this.props.relay.hasMore() && (
          <div styleName="loadButton">
            <Button
              big
              load
              onClick={this.productsRefetch}
              dataTest="shopProductsLoadMoreButton"
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

export default createPaginationContainer(
  withRouter(StoreItems),
  graphql`
    fragment StoreItems_shop on Store
      @argumentDefinitions(
        autocompleteValue: { type: "String!", defaultValue: "" }
        searchTerm: { type: "SearchProductInput!", defaultValue: { name: "" } }
        storeId: { type: "Int", defaultValue: null }
        first: { type: "Int", defaultValue: 8 }
        after: { type: "ID", defaultValue: null }
      ) {
      findProduct(
        first: $first
        after: $after
        searchTerm: $searchTerm
        visibility: "active"
      ) @connection(key: "StoreItems_findProduct") {
        edges {
          node {
            id
            rawId
            currency
            name {
              text
              lang
            }
            store {
              name {
                text
                lang
              }
            }
            category {
              rawId
            }
            storeId
            products(first: 1) {
              edges {
                node {
                  id
                  rawId
                  discount
                  photoMain
                  cashback
                  price
                  customerPrice {
                    price
                    currency
                  }
                  attributes {
                    attribute {
                      id
                    }
                    value
                  }
                }
              }
            }
            rating
          }
        }
        pageInfo {
          endCursor
        }
      }
      autoCompleteProductName(first: 8, name: $autocompleteValue) {
        edges {
          node
        }
      }
    }
  `,
  {
    direction: 'forward',
    getConnectionFromProps: props => props.shop && props.shop.findProduct,
    getVariables: (props, { count }, prevFragmentVars) => ({
      storeId: prevFragmentVars.storeId,
      first: count,
      after: props.shop.findProduct.pageInfo.endCursor,
      autocompleteValue: prevFragmentVars.autocompleteValue,
      searchTerm: prevFragmentVars.searchTerm,
    }),
    query: graphql`
      query StoreItems_shop_Query(
        $storeId: Int!
        $first: Int
        $after: ID
        $autocompleteValue: String!
        $searchTerm: SearchProductInput!
      ) {
        store(id: $storeId) {
          ...StoreItems_shop
            @arguments(
              storeId: $storeId
              first: $first
              after: $after
              autocompleteValue: $autocompleteValue
              searchTerm: $searchTerm
            )
        }
      }
    `,
  },
);
