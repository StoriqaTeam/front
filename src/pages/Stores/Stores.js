// @flow

import React, { Component } from 'react';
import { matchShape } from 'found';
import { createPaginationContainer, graphql, Relay } from 'react-relay';
import { map, pathOr } from 'ramda';

import { Button } from 'components/common/Button';
import { Container, Row, Col } from 'layout';
import { MobileSidebar } from 'components/MobileSidebar';
import { Page } from 'components/App';
import { withErrorBoundary } from 'components/common/ErrorBoundaries';

import { fromSearchFilters, fromQueryString } from './StoreUtils';

import StoresSidebar from './StoresSidebar';
import StoresHeader from './StoresHeader';
import StoresRow from './StoresRow';

import storesData from './stores.json';

import type { Stores_search as SearchType } from './__generated__/Stores_search.graphql';

import './Stores.scss';

import t from './i18n';

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
  isSidebarOpen: boolean,
};

class Stores extends Component<PropsType, StateType> {
  static getDerivedStateFromProps(
    nextProps: PropsType,
    nextState: StateType,
  ): StateType | null {
    const { search, match } = nextProps;
    const categories = fromSearchFilters(search, ['category', 'children']);
    const category = fromQueryString(match, 'category')(categories, 'id');
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
        isSidebarOpen: false,
      };
    }
  }
  storesReFetch = (): void => {
    const {
      relay: { loadMore },
    } = this.props;
    loadMore(8);
  };
  handleSidebar = () => {
    this.setState(({ isSidebarOpen }) => ({
      isSidebarOpen: !isSidebarOpen,
    }));
  };
  render() {
    const { category, isSidebarOpen } = this.state;
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
    const title = (
      <span>
        <b>{totalCount}</b> {t.storesFound}
      </span>
    );
    return (
      <div styleName="container">
        <MobileSidebar
          isOpen={isSidebarOpen}
          onClose={this.handleSidebar}
          title={title}
        >
          <StoresSidebar
            search={this.props.search}
            onClose={this.handleSidebar}
          />
        </MobileSidebar>
        <Container>
          <StoresHeader
            title={title}
            category={category}
            onFilter={this.handleSidebar}
            searchValue={searchValue}
          />
          <Row>
            <Col sm={1} md={1} lg={2} xl={2} lgVisible>
              <StoresSidebar search={this.props.search} />
            </Col>
            <Col sm={12} md={12} lg={10} xl={10}>
              {stores && stores.length > 0 ? (
                map(
                  storesItem => (
                    <StoresRow
                      store={storesItem.node}
                      key={storesItem.node.id}
                    />
                  ),
                  stores,
                )
              ) : (
                <div>{t.noStoresFound}</div>
              )}
              {this.props.relay.hasMore() && (
                <div styleName="button">
                  <Button
                    big
                    load
                    onClick={this.storesReFetch}
                    dataTest="searchStoresLoadMoreButton"
                    wireframe
                  >
                    {t.loadMore}
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
  // $FlowIgnoreMe
  withErrorBoundary(Page(Stores)),
  graphql`
    fragment Stores_search on Search
      @argumentDefinitions(
        text: { type: "SearchStoreInput!" }
        first: { type: "Int", defaultValue: 8 }
        after: { type: "ID", defaultValue: null }
      ) {
      findStore(
        searchTerm: $text
        first: $first
        after: $after
        visibility: "published"
      ) @connection(key: "Stores_findStore") {
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
            findMostViewedProducts(first: 4, searchTerm: {}) {
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
