// @flow

import React, { Component } from 'react';
import { matchShape } from 'found';
import { createPaginationContainer, graphql, Relay } from 'react-relay';
import { map, pathOr } from 'ramda';

import { withErrorBoundary } from 'components/common/ErrorBoundaries';
import { Page } from 'components/App';
import { Button } from 'components/common/Button';
import { Container, Row, Col } from 'layout';

import { buildCategory } from './StoreUtils';

import StoresSidebar from './StoresSidebar';
import StoreRow from './StoreRow';

import './Stores.scss';

import storesData from './stores.json';

import type { Stores_search as SearchType } from './__generated__/Stores_search.graphql';

type SelectedType = {
  id: string,
  label: string,
};

type PropsType = {
  // eslint-disable-next-line
  match: matchShape,
  search: SearchType,
  relay: Relay,
};

type StateType = {
  category: ?SelectedType,
};

class Stores extends Component<PropsType, StateType> {
  static getDerivedStateFromProps(
    nextProps: PropsType,
    nextState: StateType,
  ): StateType | null {
    const { search, match } = nextProps;
    const category = buildCategory(search, match);
    if (category) {
      return {
        ...nextState,
        category,
      };
    }
    return null;
  }
  // TODO: I don't know what's for 'constructor' so I leave it in the meantime
  constructor(props: PropsType) {
    super(props);
    if (storesData) {
      this.state = {
        category: null,
      };
    }
  }
  storesReFetch = (): void => {
    const {
      relay: { loadMore },
    } = this.props;
    loadMore(8);
  };
  render() {
    const { category } = this.state;
    // $FlowIgnore
    const stores = pathOr([], ['search', 'findStore', 'edges'], this.props);
    // $FlowIgnore
    const totalCount = pathOr(
      0,
      ['search', 'findStore', 'pageInfo', 'searchFilters', 'totalCount'],
      this.props,
    );
    // $FlowIgnore
    const searchValue = pathOr(
      null,
      ['location', 'query', 'search'],
      this.props,
    );
    return (
      <div styleName="container">
        <Container>
          <Row>
            <Col sm={1} md={3} lg={2} xl={2}>
              <div styleName="countInfo">
                <b>{totalCount}</b> stores found
                {searchValue && <span> with {searchValue} in the title</span>}
              </div>
            </Col>
            <Col sm={10} md={10} lg={10} xl={10}>
              <div styleName="breadcrumbs">
                All stores{category && ` / ${category.label}`}
              </div>
            </Col>
          </Row>
          <Row>
            <Col sm={1} md={1} lg={2} xl={2}>
              <StoresSidebar search={this.props.search} />
            </Col>
            <Col sm={12} md={12} lg={10} xl={10}>
              {stores && stores.length > 0 ? (
                map(
                  storesItem => (
                    <StoreRow
                      store={storesItem.node}
                      key={storesItem.node.id}
                    />
                  ),
                  stores,
                )
              ) : (
                <div>No stores found</div>
              )}
              {this.props.relay.hasMore() && (
                <div styleName="button">
                  <Button
                    big
                    load
                    onClick={this.storesReFetch}
                    dataTest="searchStoresLoadMoreButton"
                  >
                    Load more
                  </Button>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default createPaginationContainer(
  withErrorBoundary(Page(Stores, true)),
  graphql`
    fragment Stores_search on Search
      @argumentDefinitions(
        text: { type: "SearchStoreInput!" }
        first: { type: "Int", defaultValue: 8 }
        after: { type: "ID", defaultValue: null }
      ) {
      findStore(searchTerm: $text, first: $first, after: $after)
        @connection(key: "Stores_findStore") {
        pageInfo {
          searchFilters {
            totalCount
            category {
              id
              rawId
              children {
                id
                rawId
                name {
                  lang
                  text
                }
              }
            }
            country
          }
        }
        edges {
          cursor
          node {
            id
            rawId
            name {
              lang
              text
            }
            logo
            cover
            slug
            shortDescription {
              lang
              text
            }
            baseProducts(first: 4) {
              edges {
                node {
                  id
                  rawId
                  products {
                    edges {
                      node {
                        photoMain
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
  `,
  {
    direction: 'forward',
    getConnectionFromProps: props => props.search && props.search.findStore,
    getVariables: (props, { count }, prevFragmentVars) => ({
      text: prevFragmentVars.text,
      after: props.search.findStore.pageInfo.endCursor,
      first: count + 1,
    }),
    query: graphql`
      query Stores_edges_Query(
        $first: Int
        $after: ID
        $text: SearchStoreInput!
      ) {
        search {
          ...Stores_search @arguments(first: $first, after: $after, text: $text)
        }
      }
    `,
  },
);
