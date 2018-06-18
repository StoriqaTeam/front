// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { pathOr, map } from 'ramda';
import { createPaginationContainer, graphql, Relay } from 'react-relay';
import { withRouter, routerShape } from 'found';

import { withErrorBoundary } from 'components/common/ErrorBoundaries';
import { flattenFunc, getNameText, searchPathByParent } from 'utils';
import { Container, Col, Row } from 'layout';
import { Page } from 'components/App';
import { Button } from 'components/common/Button';
import { CardProduct } from 'components/CardProduct';

import SearchSidebar from './SearchSidebar';

import type { Categories_search as CategoriesSearch } from './__generated__/Categories_search.graphql';

import './Categories.scss';

type PropsType = {
  router: routerShape,
  relay: Relay,
  /* eslint-disable react/no-unused-prop-types */
  search: CategoriesSearch,
};

const productsPerRequest = 24;

class Categories extends Component<PropsType, {}> {
  productsRefetch = (): void => {
    this.props.relay.loadMore(productsPerRequest);
  };

  renderBreadcrumbs = () => {
    // $FlowIgnoreMe
    const categoryId = pathOr(
      null,
      ['match', 'location', 'query', 'category'],
      this.props,
    );
    // $FlowIgnoreMe
    const categories = pathOr(
      null,
      [
        'search',
        'findProduct',
        'pageInfo',
        'searchFilters',
        'categories',
        'children',
      ],
      this.props,
    );
    if (!categories || !categoryId) {
      return (
        <div styleName="breadcrumbs">
          <div
            styleName="item"
            onClick={() => this.props.router.push('/categories?search=')}
            onKeyDown={() => {}}
            role="button"
            tabIndex="0"
          >
            All categories
          </div>
        </div>
      );
    }
    const arr = flattenFunc(categories);
    const pathArr = searchPathByParent(arr, parseInt(categoryId, 10));
    return (
      <div styleName="breadcrumbs">
        <div
          styleName="item"
          onClick={() => this.props.router.push('/categories?search=')}
          onKeyDown={() => {}}
          role="button"
          tabIndex="0"
        >
          All categories
        </div>
        {pathArr.length !== 0 &&
          pathArr.map(item => (
            <div key={item.rawId} styleName="item">
              <span styleName="separator">/</span>
              <div
                styleName={classNames('item', {
                  active: item.rawId === parseInt(categoryId, 10),
                })}
                onClick={() =>
                  this.props.router.push(
                    `/categories?search=&category=${item.rawId}`,
                  )
                }
                onKeyDown={() => {}}
                role="button"
                tabIndex="0"
              >
                {getNameText(item.name, 'EN')}
              </div>
            </div>
          ))}
      </div>
    );
  };

  render() {
    // $FlowIgnoreMe
    const products = pathOr([], ['search', 'findProduct', 'edges'], this.props);
    // $FlowIgnoreMe
    const productsWithVariants = map(item => item.node, products);
    return (
      <div styleName="container">
        <Container>
          <Row>
            <Col sm={1} md={1} lg={2} xl={2}>
              <SearchSidebar search={this.props.search} />
            </Col>
            <Col sm={12} md={12} lg={10} xl={10}>
              <div styleName="contentContainer">
                <div styleName="topContentContainer">
                  {this.renderBreadcrumbs()}
                </div>
                <div styleName="productsContainer">
                  {productsWithVariants &&
                    productsWithVariants.map(item => (
                      <div key={item.id} styleName="cardWrapper">
                        <CardProduct item={item} />
                      </div>
                    ))}
                  {this.props.relay.hasMore() && (
                    <div styleName="button">
                      <Button
                        big
                        load
                        onClick={this.productsRefetch}
                        dataTest="searchProductLoadMoreButton"
                      >
                        Load more
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

Categories.contextTypes = {
  directories: PropTypes.object,
};

export default createPaginationContainer(
  withErrorBoundary(withRouter(Page(Categories, true))),
  graphql`
    fragment Categories_search on Search
      @argumentDefinitions(
        text: { type: "SearchProductInput!" }
        first: { type: "Int", defaultValue: 24 }
        after: { type: "ID", defaultValue: null }
      ) {
      findProduct(searchTerm: $text, first: $first, after: $after)
        @connection(key: "Categories_findProduct") {
        pageInfo {
          searchFilters {
            categories {
              rawId
              level
              parentId
              name {
                text
                lang
              }
              children {
                rawId
                level
                parentId
                name {
                  text
                  lang
                }
                children {
                  rawId
                  level
                  parentId
                  name {
                    text
                    lang
                  }
                  children {
                    rawId
                    level
                    parentId
                    name {
                      text
                      lang
                    }
                  }
                }
              }
            }
            priceRange {
              minValue
              maxValue
            }
            attrFilters {
              attribute {
                id
                rawId
                name {
                  text
                  lang
                }
                metaField {
                  uiElement
                }
              }
              equal {
                values
              }
              range {
                minValue
                maxValue
              }
            }
          }
        }
        edges {
          node {
            id
            rawId
            currencyId
            name {
              text
              lang
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
      }
    }
  `,
  {
    direction: 'forward',
    getConnectionFromProps: props => props.search && props.search.findProduct,
    getVariables: (props, _, prevFragmentVars) => ({
      text: prevFragmentVars.text,
      first: productsPerRequest,
      after: props.search.findProduct.pageInfo.endCursor,
    }),
    query: graphql`
      query Categories_edges_Query(
        $first: Int
        $after: ID
        $text: SearchProductInput!
      ) {
        search {
          ...Categories_search
            @arguments(first: $first, after: $after, text: $text)
        }
      }
    `,
  },
);
