// @flow

import React, { Component } from 'react';
import { routerShape } from 'found';
import { createPaginationContainer, graphql, Relay } from 'react-relay';
import { map, pathOr, find, propEq, assocPath, addIndex } from 'ramda';

import { withErrorBoundary } from 'components/common/ErrorBoundaries';
import { Page } from 'components/App';
import { Select } from 'components/common/Select';
import { Button } from 'components/common/Button';
import { Container, Row, Col } from 'layout';
import { urlToInput, inputToUrl } from 'utils';

import StoreRow from './StoreRow';

import './Stores.scss';

import storesData from './stores.json';

type SelectedType = {
  id: string,
  label: string,
};

type PropsType = {
  router: routerShape,
  relay: Relay,
};

type StateType = {
  category: ?SelectedType,
  country: ?SelectedType,
  categories: Array<SelectedType>,
  countries: Array<SelectedType>,
};

class Stores extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    if (storesData) {
      this.state = {
        category: null,
        country: null,
        categories: [],
        countries: [],
      };
    }
  }

  componentWillMount() {
    const lang = 'EN';
    const rawCategories = pathOr(
      [],
      [
        'search',
        'findStore',
        'pageInfo',
        'searchFilters',
        'category',
        'children',
      ],
      this.props,
    );
    const categories = map(item => {
      const name = find(propEq('lang', lang))(item.name);
      return {
        id: String(item.rawId),
        label: name && name.text ? name.text : '',
      };
    }, rawCategories);
    this.setState({ categories });
    const category = pathOr(
      null,
      ['match', 'location', 'query', 'category'],
      this.props,
    );
    if (category) {
      this.setState({ category: find(propEq('id', category))(categories) });
    }

    const rawCountries = pathOr(
      [],
      ['search', 'findStore', 'pageInfo', 'searchFilters', 'country'],
      this.props,
    );
    const mapIndexed = addIndex(map);
    const countries = mapIndexed(
      (item, idx) => ({
        id: String(idx),
        label: item,
      }),
      rawCountries,
    );
    this.setState({ countries });
    const country = pathOr(
      null,
      ['match', 'location', 'query', 'country'],
      this.props,
    );
    if (country) {
      this.setState({ country: find(propEq('label', country))(countries) });
    }
  }

  storesRefetch = () => {
    this.props.relay.loadMore(8);
  };

  handleCategory = (category: { id: string, label: string }) => {
    this.setState({ category });
    const queryObj = pathOr('', ['match', 'location', 'query'], this.props);
    const oldPreparedObj = urlToInput(queryObj);
    const newPreparedObj = assocPath(
      ['options', 'categoryId'],
      category ? category.id : null,
      oldPreparedObj,
    );
    const newUrl = inputToUrl(newPreparedObj);
    this.props.router.push(`/stores${newUrl}`);
  };

  handleLocation = (country: { id: string, label: string }) => {
    this.setState({ country });
    const queryObj = pathOr('', ['match', 'location', 'query'], this.props);
    const oldPreparedObj = urlToInput(queryObj);
    const newPreparedObj = assocPath(
      ['options', 'country'],
      country ? country.label : null,
      oldPreparedObj,
    );
    const newUrl = inputToUrl(newPreparedObj);
    this.props.router.push(`/stores${newUrl}`);
  };

  render() {
    const { categories, countries, category, country } = this.state;
    const stores = pathOr([], ['search', 'findStore', 'edges'], this.props);
    const totalCount = pathOr(
      0,
      ['search', 'findStore', 'pageInfo', 'searchFilters', 'totalCount'],
      this.props,
    );
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
            <Col sm={1} md={3} lg={2} xl={2}>
              <div styleName="storeSidebar">
                {/* <div styleName="countInfo">
                <b>{totalCount}</b> stores found
                {searchValue && <span> with {searchValue} in the title</span>}
              </div> */}
                <div styleName="filterItem">
                  <Select
                    forSearch
                    withEmpty
                    label="Categories"
                    activeItem={category}
                    items={categories}
                    onSelect={this.handleCategory}
                    dataTest="storesCategoriesSelect"
                  />
                </div>
                <div styleName="filterItem">
                  <Select
                    forSearch
                    withEmpty
                    label="Location"
                    activeItem={country}
                    items={countries}
                    onSelect={this.handleLocation}
                    dataTest="storesLocationSelect"
                  />
                </div>
              </div>
            </Col>
            <Col sm={12} md={12} lg={10} xl={10}>
              <div styleName="stores">
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
              </div>
              {this.props.relay.hasMore() && (
                <div styleName="button">
                  <Button
                    big
                    load
                    onClick={this.storesRefetch}
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
