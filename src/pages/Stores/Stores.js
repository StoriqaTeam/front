// @flow

import React, { Component } from 'react';
import { createPaginationContainer, graphql } from 'react-relay';
import { map, find, propEq, pathOr, head } from 'ramda';
import { Link } from 'found';

import { Page } from 'components/App';
import { MiniSelect } from 'components/MiniSelect';
import { Button } from 'components/Button';
import { Icon } from 'components/Icon';
import { Container, Row, Col } from 'layout';

import StoreRow from './StoreRow';

import './Stores.scss';

import storesData from './stores.json';

type PropsType = {
  search: {},
  categories: any,
  searchTerm: string,
};

type StateType = {
  stores: ?Array<{
    node: {
      id: string,
      rawId: string,
      name: Array<{
        lang: string,
        text: string,
      }>,
      logo: string,
      productsCount: string,
      baseProductsWithVariants: {
        edges: Array<{
          node: {
            id: string,
            rawId: string,
            variants: Array<{
              id: string,
              rawId: string,
              product: {
                photoMain: string,
              }
            }>,
          }
        }>,
      },
    }
  }>,
  category: { id: string, label: string },
  location: { id: string, label: string },
  sortItem: { id: string, label: string },
};

const storesPerRequest = 1;

class Stores extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    if (storesData) {
      this.state = {
        stores: storesData,
        category: { id: '1', label: 'Детские товары' },
        location: { id: '1', label: 'Россия' },
        sortItem: { id: '1', label: 'Цена (убывание)' },
      };
    }
  }

  componentWillReceiveProps(nextProps: PropsType) {
    console.log({ nextProps });
  }
  storesRefetch = () => {
    this.props.relay.loadMore(1);
    // const query = pathOr('', ['location', 'query', 'search'], this.props);
    // const stores = pathOr([], ['search', 'findStore', 'stores', 'edges'], this.props);
    // this.props.relay.refetch({
    //   first: 3,
    //   after: stores.length,
    //   text: {
    //     name: query,
    //     getStoresTotalCount: false,
    //   },
    // },
    // {
    //   first: 100,
    //   after: null,
    //   text: {
    //     name: query,
    //     getStoresTotalCount: false,
    //   },
    // },
    // () => {},
    // null,
    // );
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
    return (
      <Container>
        <Row>
          {/* <> */}
        </Row>
        <Row>
          <Col size={2}>
            <div styleName="countInfo">
              <b>2 741</b> магазинов найдено с trade в названии
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
      first: { type: "Int", defaultValue: 1 }
      after: { type: "ID", defaultValue: null }
    ) {
      findStore(searchTerm: $text, first: $first, after: $after) @connection(key: "Stores_findStore") {
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
      first: count + storesPerRequest,
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
