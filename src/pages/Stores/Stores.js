// @flow

import React, { Component } from 'react';
import { createPaginationContainer, graphql, Relay } from 'react-relay';
import { map, pathOr } from 'ramda';

import { Page } from 'components/App';
import { MiniSelect } from 'components/MiniSelect';
import { Button } from 'components/Button';
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
        category: { id: '1', label: 'Детские товары' },
        location: { id: '1', label: 'Россия' },
        sortItem: { id: '1', label: 'Цена (убывание)' },
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
              <b>{totalCount}</b> магазинов найдено
              {searchValue && <span> с {searchValue} в названии</span>}
            </div>
            <div styleName="filterItem">
              <MiniSelect
                forSearch
                label="Категория магазина"
                activeItem={category}
                items={[
                  { id: '1', label: 'Детские товары' },
                  { id: '2', label: 'Недетские товары' },
                ]}
                onSelect={this.handleCategory}
              />
            </div>
            <div styleName="filterItem">
              <MiniSelect
                forSearch
                label="Расположение магазина"
                activeItem={location}
                items={[
                  { id: '1', label: 'Россия' },
                  { id: '2', label: 'Норвегия' },
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
                    Все магазины / {category.label} / {location.label}
                  </div>
                </Col>
                <Col size={6}>
                  <div styleName="sort">
                    <div styleName="sortLabel">Сортировать по:</div>
                    <div styleName="sortSelect">
                      <MiniSelect
                        forSearch
                        activeItem={sortItem}
                        items={[
                          { id: '1', label: 'Цена (убывание)' },
                          { id: '2', label: 'Цена (возрастание)' },
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
                  onClick={this.storesRefetch}
                  forLoad
                >
                  Загрузить
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
            baseProductsWithVariants {
              edges {
                node {
                  id
                  rawId
                  variants {
                    id
                    rawId
                    product {
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
