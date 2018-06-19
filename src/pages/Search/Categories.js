// @flow

import React, { PureComponent } from 'react';
import { createPaginationContainer, graphql, Relay } from 'react-relay';

import { withErrorBoundary } from 'components/common/ErrorBoundaries';
import { Container, Col, Row } from 'layout';
import { Page } from 'components/App';

import SearchSidebar from './SearchSidebar';

import { SearchContent } from './index';

import type { Categories_search as CategoriesSearch } from './__generated__/Categories_search.graphql';

import './Categories.scss';

type PropsType = {
  relay: Relay,
  search: CategoriesSearch,
};

const productsPerRequest = 24;

class Categories extends PureComponent<PropsType> {
  render() {
    const { search, relay } = this.props;
    return (
      <div styleName="container">
        <Container>
          <Row>
            <Col sm={1} md={1} lg={2} xl={2}>
              <SearchSidebar search={search} />
            </Col>
            <Col sm={12} md={12} lg={10} xl={10}>
              <SearchContent
                productsPerRequest={productsPerRequest}
                relay={relay}
                search={search}
              />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default createPaginationContainer(
  withErrorBoundary(Page(Categories, true)),
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
