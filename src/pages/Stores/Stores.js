// @flow

import React, { Component } from 'react';
import { createPaginationContainer, graphql, Relay } from 'react-relay';
import { map, pathOr } from 'ramda';

import { Page } from 'components/App';
import { Select } from 'components/common/Select';
import { Button } from 'components/common/Button';
import { Container, Row, Col } from 'layout';

import StoreRow from './StoreRow';

import './Stores.scss';

import storesData from './stores.json';

type PropsType = {
  relay: Relay
};

type StateType = {
  category: { id: string, label: string },
  location: { id: string, label: string },
  sortItem: { id: string, label: string },
};

class Stores extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    if (storesData) {
      this.state = {
        category: { id: '1', label: 'Childens goods' },
        location: { id: '1', label: 'Russia' },
        sortItem: { id: '1', label: 'Price (ascending)' },
      };
    }
  }

  storesRefetch = () => {
    this.props.relay.loadMore(8);
  };

  handleCategory = (category: { id: string, label: string }) => {
    this.setState({ category });
  };

  handleLocation = (location: { id: string, label: string }) => {
    this.setState({ location });
  };

  handleSort = (sortItem: { id: string, label: string }) => {
    this.setState({ sortItem });
  };

  render() {
    const {
      category,
      location,
      sortItem,
    } = this.state;
    const stores = pathOr([], ['search', 'findStore', 'edges'], this.props);
    const totalCount = pathOr(0, ['search', 'findStore', 'pageInfo', 'totalCount'], this.props);
    const searchValue = pathOr(null, ['location', 'query', 'search'], this.props);
    return (
      <Container>
        <Row>
          <Col size={2}>
            <div styleName="countInfo">
              <b>{totalCount}</b> stores found
              {searchValue && <span> with {searchValue} in the title</span>}
            </div>
            <div styleName="filterItem">
              <Select
                forSearch
                label="Categories"
                activeItem={category}
                items={[
                  { id: '1', label: 'Childens goods' },
                  { id: '2', label: 'Non-childrens goods' },
                ]}
                onSelect={this.handleCategory}
              />
            </div>
            <div styleName="filterItem">
              <Select
                forSearch
                label="Location"
                activeItem={location}
                items={[
                  { id: '1', label: 'Russia' },
                  { id: '2', label: 'Norwey' },
                ]}
                onSelect={this.handleLocation}
              />
            </div>
          </Col>
          <Col size={10}>
            <div styleName="header">
              <Row>
                <Col size={6}>
                  <div styleName="breadcrumbs">
                    All stores / {category.label}
                  </div>
                </Col>
                <Col size={6}>
                  <div styleName="sort">
                    <div styleName="sortLabel">Sort by:</div>
                    <div styleName="sortSelect">
                      <Select
                        forSearch
                        activeItem={sortItem}
                        items={[
                          { id: '1', label: 'Price (decrease)' },
                          { id: '2', label: 'Price (ascending)' },
                        ]}
                        onSelect={this.handleSort}
                      />
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
            <div styleName="stores">
              {(stores && stores.length > 0) ?
                map(storesItem => (
                  <div key={storesItem.node.id}>
                    <StoreRow
                      store={storesItem.node}
                      key={storesItem.node.id}
                    />
                  </div>
                ), stores) :
                <div>No stores found</div>
              }
            </div>
            {this.props.relay.hasMore() && (
              <div styleName="button">
                <Button
                  big
                  load
                  onClick={this.storesRefetch}
                >
                  Load more
                </Button>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default createPaginationContainer(
  Page(Stores),
  graphql`
    fragment Stores_search on Search
    @argumentDefinitions(
      text: { type: "SearchStoreInput!" }
      first: { type: "Int", defaultValue: 8 }
      after: { type: "ID", defaultValue: null }
    ) {
      findStore(searchTerm: $text, first: $first, after: $after) @connection(key: "Stores_findStore") {
        pageInfo {
          totalCount
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
            baseProducts {
              edges {
                node {
                  id
                  rawId
                  variants {
                    all {
                      id
                      rawId
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
      query Stores_edges_Query($first: Int, $after: ID, $text: SearchStoreInput!) {
        search {
          ...Stores_search @arguments(first: $first, after: $after, text: $text)
        }
      }
    `,
  },
);
